import {
  initConnection,
  endConnection,
  getProducts,
  requestPurchase,
  getAvailablePurchases,
  finishTransaction,
  Purchase,
  Product,
  purchaseUpdatedListener,
  purchaseErrorListener,
} from 'react-native-iap';
import {Platform} from 'react-native';
import {useSettingsStore} from '../stores/settingsStore';

// Product IDs
const PRODUCT_IDS = Platform.select({
  ios: ['com.podcastbox.pro.monthly', 'com.podcastbox.pro.yearly', 'com.podcastbox.pro.lifetime'],
  android: ['com.podcastbox.pro.monthly', 'com.podcastbox.pro.yearly', 'com.podcastbox.pro.lifetime'],
}) as string[];

export interface IAPProduct {
  productId: string;
  title: string;
  description: string;
  price: string;
  localizedPrice: string;
  currency: string;
  type: 'monthly' | 'yearly' | 'lifetime';
}

class IAPService {
  private purchaseUpdateSubscription: any;
  private purchaseErrorSubscription: any;
  private initialized: boolean = false;

  /**
   * Initialize IAP connection
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      await initConnection();
      console.log('IAP initialized');

      // Set up purchase listeners
      this.purchaseUpdateSubscription = purchaseUpdatedListener(
        async (purchase: Purchase) => {
          console.log('Purchase updated:', purchase);
          await this.handlePurchase(purchase);
        }
      );

      this.purchaseErrorSubscription = purchaseErrorListener((error: any) => {
        console.warn('Purchase error:', error);
      });

      // Check for existing purchases
      await this.restorePurchases();

      this.initialized = true;
    } catch (error) {
      console.error('IAP initialization error:', error);
      throw error;
    }
  }

  /**
   * Get available products
   */
  async getProducts(): Promise<IAPProduct[]> {
    try {
      const products = await getProducts({skus: PRODUCT_IDS});

      return products.map(product => ({
        productId: product.productId,
        title: product.title,
        description: product.description,
        price: product.price,
        localizedPrice: product.localizedPrice,
        currency: product.currency,
        type: this.getProductType(product.productId),
      }));
    } catch (error) {
      console.error('Get products error:', error);
      return [];
    }
  }

  /**
   * Purchase a product
   */
  async purchaseProduct(productId: string): Promise<boolean> {
    try {
      await requestPurchase({sku: productId});
      return true;
    } catch (error) {
      console.error('Purchase product error:', error);
      return false;
    }
  }

  /**
   * Handle successful purchase
   */
  private async handlePurchase(purchase: Purchase): Promise<void> {
    try {
      // Verify purchase with backend (if you have one)
      // For offline-first app, we'll trust the platform

      const {productId, transactionReceipt} = purchase;

      // Grant Pro access
      const settingsStore = useSettingsStore.getState();
      await settingsStore.setPro(true);

      // Finish the transaction
      await finishTransaction({purchase, isConsumable: false});

      console.log('Purchase completed:', productId);
    } catch (error) {
      console.error('Handle purchase error:', error);
    }
  }

  /**
   * Restore previous purchases
   */
  async restorePurchases(): Promise<boolean> {
    try {
      const purchases = await getAvailablePurchases();

      if (purchases && purchases.length > 0) {
        // User has purchased Pro
        const settingsStore = useSettingsStore.getState();
        await settingsStore.setPro(true);
        console.log('Pro access restored');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Restore purchases error:', error);
      return false;
    }
  }

  /**
   * Check if user has Pro
   */
  async hasProAccess(): Promise<boolean> {
    try {
      const purchases = await getAvailablePurchases();
      return purchases && purchases.length > 0;
    } catch (error) {
      console.error('Check Pro access error:', error);
      return false;
    }
  }

  /**
   * Get product type from ID
   */
  private getProductType(productId: string): 'monthly' | 'yearly' | 'lifetime' {
    if (productId.includes('monthly')) return 'monthly';
    if (productId.includes('yearly')) return 'yearly';
    return 'lifetime';
  }

  /**
   * Cleanup IAP connection
   */
  async cleanup(): Promise<void> {
    if (this.purchaseUpdateSubscription) {
      this.purchaseUpdateSubscription.remove();
    }
    if (this.purchaseErrorSubscription) {
      this.purchaseErrorSubscription.remove();
    }
    await endConnection();
    this.initialized = false;
  }
}

export const iapService = new IAPService();
