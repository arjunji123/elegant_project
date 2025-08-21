import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Pressable, Image, GestureResponderEvent } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Arrowleft from "../../assets/icons/Arrowleft.png";
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import Button from '../../components/Button';

const CATEGORIES = ['All Items', 'Newest', 'T-shirt', 'Pants', 'Shoes'];
const RATINGS = [5, 4, 3, 2, 1];
const SORT_OPTIONS = [
    'Price: High to Low',
    'Price: Low to High',
    'Newest to Old',
    'Old to New',
];

const CustomLabel = ({ oneMarkerValue }) => (
    <View style={styles.labelContainer}>
        <Text style={styles.labelText}>${oneMarkerValue}</Text>
        <View style={styles.labelArrow} />
    </View>
);

const CustomMarker = () => (
    <View style={styles.markerStyle} />
);

const AdvanceFilter = ({ navigation }) => {
    const [selectedCategory, setSelectedCategory] = useState('Newest');
    const [priceRange, setPriceRange] = useState([20, 90]);
    const [selectedRating, setSelectedRating] = useState('All');
    const [sortOption, setSortOption] = useState('Price: High to Low');
    const [range, setRange] = useState([20, 90]);

    const onValuesChange = (vals) => setPriceRange(vals);

    const resetFilter = () => {
        setSelectedCategory('Newest');
        setPriceRange([20, 90]);
        setSelectedRating('All');
        setSortOption('Price: High to Low');
    };
    const handleGoBack = () => navigation.goBack();

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={handleGoBack} style={styles.backButton}>
                    <Image source={Arrowleft} style={styles.backIcon} />
                </Pressable>
                <Text style={styles.title}>Filter</Text>
            </View>

            {/* Category */}
            <Text style={styles.sectionTitle}>Category</Text>
            <ScrollView
                style={{ maxHeight: 50 }}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ alignItems: 'center' }}
            >
                {CATEGORIES.map((cat) => (
                    <TouchableOpacity
                        key={cat}
                        style={[
                            styles.chip,
                            cat === selectedCategory && styles.chipSelected,
                        ]}
                        onPress={() => setSelectedCategory(cat)}
                    >
                        <Text
                            style={[
                                styles.chipLabel,
                                cat === selectedCategory && styles.chipLabelSelected,
                            ]}
                        >
                            {cat}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Price */}
            <Text style={styles.sectionTitle}>Price</Text>
            <View style={styles.pricesRow}>
                <Text style={styles.selectedPrice}>Min: ${range[0]}</Text>
                <Text style={styles.selectedPrice}>Max: ${range[1]}</Text>
            </View>

            <View style={styles.sliderWrapper}>
                <MultiSlider
                    values={range}
                    onValuesChange={setRange}
                    min={0}
                    max={100}
                    step={1}
                    sliderLength={270}
                    selectedStyle={{ backgroundColor: '#704F38' }}
                    unselectedStyle={{ backgroundColor: '#EEE' }}
                    customLabel={CustomLabel}
                    customMarker={CustomMarker}
                    trackStyle={{ height: 3, borderRadius: 5 }}
                    allowOverlap={false}
                    snapped
                />
            </View>

            {/* Rating */}
            <Text style={styles.sectionTitle}>Rating</Text>
            <View style={styles.row}>
                <TouchableOpacity
                    style={[
                        styles.ratingChip,
                        selectedRating === 'All' && styles.ratingChipSelected
                    ]}
                    onPress={() => setSelectedRating('All')}
                >
                    <Icon name="star" size={16} color="#704F38" />
                    <Text style={selectedRating === 'All' && styles.ratingSelectedText}>All</Text>
                </TouchableOpacity>
                {RATINGS.map((r) => (
                    <TouchableOpacity
                        key={r}
                        style={[
                            styles.ratingChip,
                            selectedRating === r && styles.ratingChipSelected
                        ]}
                        onPress={() => setSelectedRating(r)}
                    >
                        <Icon name="star" size={16} color="#704F38" />
                        <Text
                            style={[
                                styles.ratingLabel,
                                selectedRating === r && styles.ratingSelectedText
                            ]}
                        >
                            {r}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>  
             
 <Text style={styles.sectionTitle}>Sort by</Text>
      <View>
        {SORT_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option}
            style={styles.sortRow}
            onPress={() => setSortOption(option)}
          >
            <View style={[
              styles.radioCircle,
              sortOption === option && styles.radioCircleSelected
            ]}/>
            <Text style={styles.sortLabel}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.applyBtn}>
<Button text={'Apply Filter'} onPress={function (event: GestureResponderEvent): void {
                throw new Error('Function not implemented.');
            } } bgColor={'#704F38'} textColor={'#fff'}/>
            <Button text={'Reset'} onPress={function (event: GestureResponderEvent): void {
                throw new Error('Function not implemented.');
            } } bgColor={'#fff'} textColor={''}/>
      </View>


              </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { padding: 16, backgroundColor: '#fff', flex: 1 },

    header: {
        position: 'relative',
        height: 40,
        justifyContent: 'center',
        marginBottom: 24,
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: { padding: 8 },
    backIcon: { width: 24, height: 24, resizeMode: 'contain' },
    title: {
        flex: 1,
        textAlign: 'center',
        fontSize: 24,
        color: '#000',
        fontWeight: 'normal',
        fontFamily: 'Poppins',
        marginRight: 40,
    },
    pricesRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 5,
        marginBottom: 10,
    },
    selectedPrice: {
        fontSize: 14,
        fontWeight: '500',
        color: '#704F38',
    },
    sectionTitle: { fontSize: 16, fontWeight: '500', marginVertical: 10 },
    row: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
    chip: {
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingVertical: 6,
        paddingHorizontal: 10,
        marginHorizontal: 5,
        marginBottom: 8,
        borderWidth: 1,
    },
    chipSelected: { backgroundColor: '#704F38' },
    chipLabel: { color: '#855C36', fontWeight: '500' },
    chipLabelSelected: { color: '#fff' },

    sliderWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 16,
        marginBottom: 8,
    },

    markerStyle: {
        height: 28,
        width: 28,
        borderRadius: 14,
        borderWidth: 3,
        borderColor: '#704F38',
        backgroundColor: '#fff',
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 2,
        shadowOffset: { width: 0, height: 2 },
    },

    labelContainer: {
        alignItems: 'center',
        marginBottom: 7,
    },

    labelText: {
        backgroundColor: '#704F38',
        color: '#fff',
        paddingVertical: 3,
        paddingHorizontal: 10,
        borderRadius: 6,
        fontWeight: '700',
        fontSize: 15,
    },

    labelArrow: {
        width: 0,
        height: 0,
        borderLeftWidth: 8,
        borderRightWidth: 8,
        borderTopWidth: 10,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: '#704F38',
        marginTop: -2,
    },
    ratingChip: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#704F38',
        borderRadius: 16,
        paddingVertical: 4,
        paddingHorizontal: 10,
        alignItems: 'center',
        marginRight: 8,
        backgroundColor: '#fff'
    },
    ratingChipSelected: {
        backgroundColor: '#000000',
    },
    ratingLabel: {
        marginLeft: 5,
        color: '#000000',
        fontWeight: '500'
    },
    ratingSelectedText: {
        color: '#fff',
        fontWeight: '500',
        marginLeft: 5
    },
      sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  radioCircle: {
    height: 18,
    width: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#704F38',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioCircleSelected: {
    backgroundColor: '#704F38',
    borderWidth: 0,
  },
  sortLabel: { fontSize: 15, color: '#333' },
    applyBtn: {
    marginTop:40
  },
 
});

export default AdvanceFilter;
