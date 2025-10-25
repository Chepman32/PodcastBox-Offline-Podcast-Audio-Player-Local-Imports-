import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Switch, ScrollView} from 'react-native';
import {useTheme} from '../theme/ThemeContext';
import {useSettingsStore} from '../stores/settingsStore';
import {AnimatedPress} from '../components/base/AnimatedPressable';

export const SettingsScreen: React.FC = () => {
  const {theme, toggleTheme, themeMode} = useTheme();
  const {
    loadSettings,
    updateSettings,
    hapticFeedback,
    showWaveform,
    lockScreenControls,
    autoplay,
    skipSilence,
    isPro,
  } = useSettingsStore();

  useEffect(() => {
    loadSettings();
  }, []);

  const renderSettingRow = (
    title: string,
    subtitle: string,
    value: boolean,
    onValueChange: (value: boolean) => void,
    disabled: boolean = false
  ) => (
    <View style={[styles.settingRow, {backgroundColor: theme.colors.surface}]}>
      <View style={styles.settingText}>
        <Text style={[styles.settingTitle, {color: theme.colors.text}]}>{title}</Text>
        <Text style={[styles.settingSubtitle, {color: theme.colors.textSecondary}]}>
          {subtitle}
        </Text>
        {disabled && !isPro && (
          <Text style={[styles.proLabel, {color: theme.colors.warning}]}>Pro Feature</Text>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled && !isPro}
        trackColor={{
          false: theme.colors.borderLight,
          true: theme.colors.primary,
        }}
        thumbColor={theme.colors.surface}
      />
    </View>
  );

  return (
    <ScrollView
      style={[styles.container, {backgroundColor: theme.colors.background}]}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={[styles.header, {backgroundColor: theme.colors.surface}]}>
        <Text style={[styles.headerTitle, {color: theme.colors.text}]}>Settings</Text>
      </View>

      {/* Appearance */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, {color: theme.colors.textSecondary}]}>
          APPEARANCE
        </Text>
        <AnimatedPress
          onPress={toggleTheme}
          style={[styles.settingRow, {backgroundColor: theme.colors.surface}]}
        >
          <View style={styles.settingText}>
            <Text style={[styles.settingTitle, {color: theme.colors.text}]}>Theme</Text>
            <Text style={[styles.settingSubtitle, {color: theme.colors.textSecondary}]}>
              Current: {themeMode}
            </Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </AnimatedPress>
      </View>

      {/* Playback */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, {color: theme.colors.textSecondary}]}>
          PLAYBACK
        </Text>
        {renderSettingRow(
          'Autoplay',
          'Continue to next track automatically',
          autoplay,
          (value) => updateSettings({autoplay: value})
        )}
        {renderSettingRow(
          'Skip Silence',
          'Automatically skip silent portions',
          skipSilence,
          (value) => updateSettings({skipSilence: value}),
          true
        )}
        {renderSettingRow(
          'Show Waveform',
          'Display audio waveform visualization',
          showWaveform,
          (value) => updateSettings({showWaveform: value})
        )}
      </View>

      {/* System */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, {color: theme.colors.textSecondary}]}>
          SYSTEM
        </Text>
        {renderSettingRow(
          'Haptic Feedback',
          'Vibrate on button presses',
          hapticFeedback,
          (value) => updateSettings({hapticFeedback: value})
        )}
        {renderSettingRow(
          'Lock Screen Controls',
          'Show player controls on lock screen',
          lockScreenControls,
          (value) => updateSettings({lockScreenControls: value})
        )}
      </View>

      {/* Pro */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, {color: theme.colors.textSecondary}]}>
          SUBSCRIPTION
        </Text>
        <View style={[styles.proCard, {backgroundColor: theme.colors.surface}]}>
          <Text style={[styles.proTitle, {color: theme.colors.text}]}>
            {isPro ? 'PodcastBox Pro' : 'Upgrade to Pro'}
          </Text>
          <Text style={[styles.proSubtitle, {color: theme.colors.textSecondary}]}>
            {isPro
              ? 'You have access to all premium features'
              : 'Unlock smart speed, chapter editor, and custom themes'}
          </Text>
          {!isPro && (
            <AnimatedPress
              style={[styles.proButton, {backgroundColor: theme.colors.primary}]}
              onPress={() => {}}
            >
              <Text style={styles.proButtonText}>Learn More</Text>
            </AnimatedPress>
          )}
        </View>
      </View>

      {/* About */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, {color: theme.colors.textSecondary}]}>
          ABOUT
        </Text>
        <View style={[styles.aboutCard, {backgroundColor: theme.colors.surface}]}>
          <Text style={[styles.aboutText, {color: theme.colors.textSecondary}]}>
            PodcastBox v1.0.0
          </Text>
          <Text style={[styles.aboutText, {color: theme.colors.textTertiary}]}>
            Offline-first podcast & audio player
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    padding: 16,
    paddingTop: 60,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: '700',
  },
  section: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginLeft: 4,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  settingText: {
    flex: 1,
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 13,
  },
  proLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  arrow: {
    fontSize: 24,
    color: '#999',
  },
  proCard: {
    padding: 20,
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  proTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  proSubtitle: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  proButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  proButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  aboutCard: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  aboutText: {
    fontSize: 14,
    marginBottom: 4,
  },
});
