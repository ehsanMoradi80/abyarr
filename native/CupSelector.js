import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import Svg, { Path, Line } from 'react-native-svg';
import { Droplets, Sparkles, Check, Plus } from 'lucide-react-native';
import { formatNumber, formatGlasses } from './strings';

export const COMMON_CUP_SIZES = [
  {
    id: 'cup-200',
    name: 'فنجان / استکان',
    volumeMl: 200,
    glasses: 0.8,
    iconType: 'cup',
  },
  {
    id: 'cup-250',
    name: 'لیوان معمولی',
    volumeMl: 250,
    glasses: 1,
    iconType: 'glass',
  },
  {
    id: 'cup-300',
    name: 'ماگ بزرگ',
    volumeMl: 300,
    glasses: 1.2,
    iconType: 'mug',
  },
  {
    id: 'cup-500',
    name: 'قمقمه / بطری',
    volumeMl: 500,
    glasses: 2,
    iconType: 'bottle',
  },
  {
    id: 'cup-750',
    name: 'بطری بزرگ',
    volumeMl: 750,
    glasses: 3,
    iconType: 'flask',
  },
];

function CupSvgIcon({ type, isSelected }) {
  const strokeColor = isSelected ? '#FFFFFF' : '#2D9CFF';

  switch (type) {
    case 'cup':
      return (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <Path d="M17 8h1a4 4 0 1 1 0 8h-1" stroke={strokeColor} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          <Path d="M3 8h14v7a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" stroke={strokeColor} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          <Line x1={6} y1={2} x2={6} y2={4} stroke={strokeColor} strokeWidth={2} strokeLinecap="round" />
          <Line x1={10} y1={2} x2={10} y2={4} stroke={strokeColor} strokeWidth={2} strokeLinecap="round" />
          <Line x1={14} y1={2} x2={14} y2={4} stroke={strokeColor} strokeWidth={2} strokeLinecap="round" />
        </Svg>
      );
    case 'mug':
      return (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <Path d="M18 8h1a3 3 0 0 1 0 6h-1" stroke={strokeColor} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          <Path d="M5 6h13v11a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3Z" stroke={strokeColor} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          <Line x1={5} y1={10} x2={18} y2={10} stroke={strokeColor} strokeWidth={2} strokeDasharray="2 2" strokeLinecap="round" />
        </Svg>
      );
    case 'bottle':
      return (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <Path d="M10 2h4" stroke={strokeColor} strokeWidth={2} strokeLinecap="round" />
          <Path d="M10 2v3a2 2 0 0 1-1 1.73A4 4 0 0 0 7 10v10a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V10a4 4 0 0 0-2-3.27A2 2 0 0 1 14 5V2" stroke={strokeColor} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          <Line x1={7} y1={14} x2={17} y2={14} stroke={strokeColor} strokeWidth={2} strokeLinecap="round" />
        </Svg>
      );
    case 'flask':
      return (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <Path d="M9 2h6" stroke={strokeColor} strokeWidth={2} strokeLinecap="round" />
          <Path d="M10 2v4a3 3 0 0 1-.8 2L5 18a2 2 0 0 0 1.6 3h10.8a2 2 0 0 0 1.6-3L14.8 8A3 3 0 0 1 14 6V2" stroke={strokeColor} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          <Line x1={7} y1={15} x2={17} y2={15} stroke={strokeColor} strokeWidth={2} strokeDasharray="2 2" strokeLinecap="round" />
        </Svg>
      );
    case 'glass':
    default:
      return (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <Path d="M5 4h14l-2 15a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 4Z" stroke={strokeColor} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          <Line x1={6} y1={9} x2={18} y2={9} stroke={strokeColor} strokeWidth={2} strokeLinecap="round" />
        </Svg>
      );
  }
}

export function CupSelector({ onAddWater, onOpenCustomAmount }) {
  const [selectedId, setSelectedId] = useState('cup-250');
  const [multiplier, setMultiplier] = useState(1);
  const [justAddedId, setJustAddedId] = useState(null);

  const selectedCup = COMMON_CUP_SIZES.find((c) => c.id === selectedId) || COMMON_CUP_SIZES[1];

  const handleAddCup = (cup, count = multiplier) => {
    const targetCup = cup || selectedCup;
    const totalGlasses = Math.round(targetCup.glasses * count * 10) / 10;
    const totalMl = targetCup.volumeMl * count;
    onAddWater(totalGlasses, totalMl);

    setJustAddedId(targetCup.id);
    setTimeout(() => setJustAddedId(null), 900);
  };

  return (
    <View style={styles.container}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <View style={styles.titleWithIcon}>
          <Droplets size={17} color="#2D9CFF" strokeWidth={2.2} />
          <Text style={styles.titleText}>انتخاب اندازه لیوان یا ظرف</Text>
        </View>

        {/* Multiplier Quick Pills */}
        <View style={styles.multiplierContainer}>
          {[1, 2, 3].map((m) => (
            <TouchableOpacity
              key={m}
              style={[
                styles.multiplierPill,
                multiplier === m && styles.multiplierPillActive,
              ]}
              onPress={() => setMultiplier(m)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.multiplierText,
                  multiplier === m && styles.multiplierTextActive,
                ]}
              >
                {formatNumber(m)}×
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Grid of Cup Cards */}
      <View style={styles.cupsGrid}>
        {COMMON_CUP_SIZES.map((cup) => {
          const isSelected = selectedId === cup.id;
          const wasJustAdded = justAddedId === cup.id;
          const calculatedGlasses = Math.round(cup.glasses * multiplier * 10) / 10;

          return (
            <TouchableOpacity
              key={cup.id}
              style={[
                styles.cupCard,
                isSelected && styles.cupCardSelected,
              ]}
              onPress={() => setSelectedId(cup.id)}
              activeOpacity={0.8}
            >
              {/* Checkmark badge when selected */}
              {isSelected && (
                <View style={styles.selectedCheckBadge}>
                  <Check size={10} color="#FFFFFF" strokeWidth={3} />
                </View>
              )}

              {/* Volume tag */}
              <View
                style={[
                  styles.volumeTag,
                  isSelected ? styles.volumeTagSelected : styles.volumeTagNormal,
                ]}
              >
                <Text
                  style={[
                    styles.volumeTagText,
                    isSelected ? styles.volumeTagTextSelected : styles.volumeTagTextNormal,
                  ]}
                >
                  {formatNumber(cup.volumeMl)} ml
                </Text>
              </View>

              {/* Vector Icon Container */}
              <View
                style={[
                  styles.iconBox,
                  isSelected ? styles.iconBoxSelected : styles.iconBoxNormal,
                ]}
              >
                <CupSvgIcon type={cup.iconType} isSelected={isSelected} />
              </View>

              {/* Name & Glasses */}
              <Text style={styles.cupNameText} numberOfLines={1}>
                {cup.name}
              </Text>
              <Text style={styles.cupGlassesText}>
                {formatGlasses(calculatedGlasses)}
              </Text>

              {/* Quick Tap-To-Add Button */}
              <TouchableOpacity
                style={[
                  styles.addBtn,
                  wasJustAdded
                    ? styles.addBtnSuccess
                    : isSelected
                    ? styles.addBtnSelected
                    : styles.addBtnNormal,
                ]}
                onPress={() => handleAddCup(cup, multiplier)}
                activeOpacity={0.7}
              >
                {wasJustAdded ? (
                  <View style={styles.addBtnContent}>
                    <Check size={11} color="#FFFFFF" strokeWidth={3} />
                    <Text style={styles.addBtnTextWhite}>ثبت شد</Text>
                  </View>
                ) : (
                  <View style={styles.addBtnContent}>
                    <Plus
                      size={11}
                      color={isSelected ? '#FFFFFF' : '#0066CC'}
                      strokeWidth={2.8}
                    />
                    <Text
                      style={[
                        styles.addBtnText,
                        isSelected ? styles.addBtnTextWhite : styles.addBtnTextBlue,
                      ]}
                    >
                      ثبت {multiplier > 1 ? `(${formatNumber(multiplier)}×)` : ''}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Selected Action Bar */}
      <View style={styles.actionBar}>
        <View style={styles.actionBarInfo}>
          <View style={styles.sparkleBox}>
            <Sparkles size={16} color="#2D9CFF" />
          </View>
          <View style={styles.actionBarTextWrapper}>
            <Text style={styles.actionBarTitle}>
              {selectedCup.name} ({formatNumber(selectedCup.volumeMl)} میلی‌لیتر)
            </Text>
            <Text style={styles.actionBarSubtitle}>
              معادل {formatGlasses(Math.round(selectedCup.glasses * multiplier * 10) / 10)} {multiplier > 1 ? `(${formatNumber(multiplier)} مرتبه)` : ''}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.confirmActionBtn}
          onPress={() => handleAddCup(selectedCup, multiplier)}
          activeOpacity={0.8}
        >
          <Plus size={14} color="#FFFFFF" strokeWidth={3} />
          <Text style={styles.confirmActionBtnText}>ثبت سریع</Text>
        </TouchableOpacity>
      </View>

      {/* Custom Amount Button */}
      {onOpenCustomAmount && (
        <TouchableOpacity
          style={styles.customAmountBar}
          onPress={onOpenCustomAmount}
          activeOpacity={0.7}
        >
          <Text style={styles.customAmountBarText}>+ ثبت مقدار دلخواه آب (میلی‌لیتر)</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  titleWithIcon: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
  },
  titleText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E293B',
    writingDirection: 'rtl',
  },
  multiplierContainer: {
    flexDirection: 'row',
    backgroundColor: '#E6F4FF',
    borderRadius: 10,
    padding: 2,
    gap: 2,
  },
  multiplierPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  multiplierPillActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  multiplierText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  multiplierTextActive: {
    color: '#2D9CFF',
    fontWeight: '800',
  },
  cupsGrid: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  cupCard: {
    flexBasis: '31%',
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  cupCardSelected: {
    backgroundColor: '#F0F9FF',
    borderColor: '#2D9CFF',
    borderWidth: 1.5,
  },
  selectedCheckBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#2D9CFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  volumeTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginBottom: 4,
  },
  volumeTagNormal: {
    backgroundColor: '#F1F5F9',
  },
  volumeTagSelected: {
    backgroundColor: 'rgba(45, 156, 255, 0.15)',
  },
  volumeTagText: {
    fontSize: 10,
    fontWeight: '800',
  },
  volumeTagTextNormal: {
    color: '#64748B',
  },
  volumeTagTextSelected: {
    color: '#0066CC',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
  },
  iconBoxNormal: {
    backgroundColor: '#E6F4FF',
  },
  iconBoxSelected: {
    backgroundColor: '#2D9CFF',
  },
  cupNameText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
    marginTop: 2,
    writingDirection: 'rtl',
  },
  cupGlassesText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#2D9CFF',
    marginTop: 1,
  },
  addBtn: {
    width: '100%',
    paddingVertical: 5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  addBtnNormal: {
    backgroundColor: '#E6F4FF',
  },
  addBtnSelected: {
    backgroundColor: '#2D9CFF',
  },
  addBtnSuccess: {
    backgroundColor: '#10B981',
  },
  addBtnContent: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 3,
  },
  addBtnText: {
    fontSize: 11,
    fontWeight: '800',
  },
  addBtnTextWhite: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  addBtnTextBlue: {
    color: '#0066CC',
  },
  actionBar: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  actionBarInfo: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  sparkleBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#E6F4FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBarTextWrapper: {
    alignItems: 'flex-end',
    flex: 1,
  },
  actionBarTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1E293B',
    writingDirection: 'rtl',
  },
  actionBarSubtitle: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1,
    writingDirection: 'rtl',
  },
  confirmActionBtn: {
    backgroundColor: '#2D9CFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
  },
  confirmActionBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  customAmountBar: {
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
  },
  customAmountBarText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2D9CFF',
  },
});
