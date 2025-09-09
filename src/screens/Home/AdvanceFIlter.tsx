import React, { useEffect, useState } from 'react';
import { View, Modal, FlatList, Text, TouchableOpacity, ScrollView, StyleSheet, Pressable, Image, GestureResponderEvent, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import Button from '../../components/Button';
import { useFilter } from "../../Context/FilterContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AnimatedLoader from '../../components/AnimatedLoader';
import Header from '../../components/Header';


// const CATEGORIES = ['All Items', 'Newest', 'T-shirt', 'Pants', 'Shoes'];
const RATINGS = [5, 4, 3, 2, 1];

const SORT_OPTIONS = [
    {
        id: "price_high_low",
        name: 'Price: High to Low'
    },
    {
        id: 'price_low_high',
        name: 'Price: Low to High'
    },
    {
        id: "newest_old",
        name: 'Newest to Old'
    },
    {
        id: 'old_new',
        name: 'Old to New'
    },
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
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedRating, setSelectedRating] = useState('All');
    const [sortOption, setSortOption] = useState("");
    const [range, setRange] = useState([0, 10000]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showMore, setShowMore] = useState(false);
    const insets = useSafeAreaInsets();

    const { setFilter } = useFilter();

    useEffect(() => {
        const loadFilters = async () => {
            try {
                const savedFilter = await AsyncStorage.getItem("userFilters");

                if (savedFilter) {
                    const parsed = JSON.parse(savedFilter);
                    setSelectedCategories(parsed.category_id || []);
                    setRange([parsed.min_price || 0, parsed.max_price || 10000]);
                    setSelectedRating(parsed.rating || "All");
                    setSortOption(parsed.sort || " ");
                }
            } catch (error) {
                console.error("Error loading filters:", error);
            }
            
        };

        loadFilters();
    }, []);

    useEffect(() => {
        const getCategories = async () => {
            try {
                const res = await fetch(`https://elegant-project.onrender.com/api/categories`, {
                    method: "GET",
                });

                const text = await res.text();

                const data = JSON.parse(text);
                console.log("Response text:", data);



                if (data.success && data.data) {
                    setCategories(data.data)
                }
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };
        getCategories()

    }, [])

  const toggleCategory = (catId: string) => {
    setSelectedCategories(prev => {
        // Use `prev || []` to ensure `prev` is always an array.
        const currentCategories = prev || []; 
        
        return currentCategories.includes(catId)
            ? currentCategories.filter(id => id !== catId) // remove
            : [...currentCategories, catId]; // add
    });
};


    const resetFilter = async () => {
        const defaultFilter = {
            category_id: [],
            subcategory_id: null,
            min_price: 0,
            max_price: 10000,
            sort: " ",
            rating: "All",
        };

        setSelectedCategories([]); 
        setRange([0, 10000]);
        setSelectedRating("All");
        setSortOption("");
        setFilter(defaultFilter);
        await AsyncStorage.setItem("userFilters", JSON.stringify(defaultFilter));
    };

    const applyFilters = async () => {
        const newFilter = {
            category_id: selectedCategories,
            subcategory_id: null,
            min_price: range[0],
            max_price: range[1],
            sort: sortOption,
            rating: selectedRating,
        };

        setFilter(newFilter);
        await AsyncStorage.setItem("userFilters", JSON.stringify(newFilter));
        navigation.navigate("FilteredProductsScreen")
    };

    const [priceError, setPriceError] = useState("");

    const handleMinPriceChange = (text) => {
        const numericText = text.replace(/[^0-9]/g, "");

        if (numericText === "") {
            setRange([0, range[1]]);
            setPriceError("");
            return;
        }

        if (numericText.length <= 5) {
            let num = parseInt(numericText);
            if (num > 10000) {
                setPriceError("You cannot add more than ₹10,000");
            } else {
                setPriceError("");
                setRange([num, range[1]]);
            }
        }
    };

    const handleMaxPriceChange = (text) => {
        const numericText = text.replace(/[^0-9]/g, "");

        if (numericText === "") {
            setRange([range[0], 0]);
            setPriceError("");
            return;
        }

        if (numericText.length <= 5) {
            let num = parseInt(numericText);
            if (num > 100000) {
                setPriceError("You cannot add more than ₹10,000");
            } else {
                setPriceError("");
                setRange([range[0], num]);
            }
        }
    };

    const handleGoBack = () => navigation.goBack();
                console.log(selectedCategories,"savedFilter")

    return (
        <><ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 150 }}>
            <Header text={"Filter"} onPress={handleGoBack} />



            <Text style={styles.sectionTitle}>Category</Text>
            <View style={styles.categoriesRow}>
                {loading ? (
                    <AnimatedLoader visible={loading} />
                ) : (
                    <>
                        {(showMore ? categories : categories.slice(0, 3)).map(cat => (
                            <TouchableOpacity
                                key={cat.id}
                                style={[
                                    styles.chip,
                                    selectedCategories.includes(cat.id) && styles.chipSelected
                                ]}
                                onPress={() => toggleCategory(cat.id)}
                            >
                                <Text
                                    style={[
                                        styles.chipLabel,
                                        selectedCategories.includes(cat.id) && styles.chipLabelSelected
                                    ]}
                                >
                                    {cat.name}
                                </Text>
                            </TouchableOpacity>
                        ))}

                        {/* 🟢 View More / Less Button */}
                        {categories.length > 3 && (
                            <TouchableOpacity
                                style={[styles.chip, { backgroundColor: '#EEE' }]}
                                onPress={() => setShowMore(!showMore)}
                            >
                                <Text style={[styles.chipLabel, { color: '#704F38' }]}>
                                    {showMore ? "View Less" : "View More"}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </>
                )}
            </View>
            {/* Price */}
            <Text style={styles.sectionTitle}>Price</Text>
            <View style={styles.pricesRow}>
                <TextInput
                    style={styles.priceInput}
                    keyboardType="numeric"
                    value={`₹${range[0]}`}
                    onChangeText={handleMinPriceChange}
                />
                <TextInput
                    style={styles.priceInput}
                    keyboardType="numeric"
                    value={`₹${range[1]}`}
                    onChangeText={handleMaxPriceChange}
                />
            </View>
            {priceError ? (
                <Text style={styles.errorText}>{priceError}</Text>
            ) : null}
            <View style={styles.sliderWrapper}>
                <MultiSlider
                    values={range}
                    onValuesChange={setRange}
                    min={0}
                    max={10000}
                    step={100}
                    sliderLength={270}
                    selectedStyle={{ backgroundColor: '#704F38' }}
                    unselectedStyle={{ backgroundColor: '#EEE' }}
                    customLabel={CustomLabel}
                    customMarker={CustomMarker}
                    trackStyle={{ height: 3, borderRadius: 5 }}
                    allowOverlap={false}
                    snapped />
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
                        key={option.id}
                        style={styles.sortRow}
                        onPress={() => setSortOption(option.id)}
                    >
                        <View style={styles.radioCircle}>
                            {sortOption === option.id && <View style={styles.selectedDot} />}
                        </View>
                        <Text style={styles.sortLabel}>{option.name}</Text>
                    </TouchableOpacity>
                ))}

            </View>



        </ScrollView><View style={[styles.footer, { paddingBottom: insets.bottom }]}>
                <Button text={'Apply Filter'} onPress={applyFilters} bgColor={'#704F38'} textColor={'#fff'} />
                <Button text={'Reset'} onPress={resetFilter} bgColor={'#fff'} textColor={'#704f38'} border={"#704f38"} />
            </View></>
    );
};

const styles = StyleSheet.create({
    container: { padding: 16, backgroundColor: '#fff', flex: 1, paddingTop: 20 },
    header: {
        position: 'relative',
        height: 40,
        justifyContent: 'center',
        marginBottom: 24,
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: { padding: 8 },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoriesRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
    errorText: {
        color: "red",
        fontSize: 12,
        marginTop: 4,
        marginLeft: 8,
    },
    modalContent: {
        width: '80%',
        maxHeight: '70%',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
        textAlign: 'center',
    },

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
    priceInputsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 5,
        marginBottom: 10,
    },
    priceInput: {
        borderWidth: 1,
        borderColor: '#704F38',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 4,
        width: 80,
        textAlign: 'center',
        color: '#000',
        fontWeight: '500',
    },

    sectionTitle: { fontSize: 16, fontWeight: '500', marginVertical: 10 },
    row: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
    chip: {
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderWidth: 1.5,
        borderRadius: 20,
        margin: 5,
        marginRight: 8,
        borderColor: "#AFAFAF",
    },
    chipSelected: { backgroundColor: '#704F38', color: '#fff', borderWidth: 0 },
    chipLabel: { color: '#704F38', fontWeight: '500' },
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
        backgroundColor: '#fff',
        margin: 5
    },
    ratingChipSelected: {
        backgroundColor: '#000000',
        borderWidth: 0,
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
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#704F38',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    selectedDot: {
        height: 10,
        width: 10,
        borderRadius: 5,
        backgroundColor: '#704F38',
    },
    // sortLabel: {
    //   fontSize: 16,
    //   color: '#333',
    // },

    sortLabel: { fontSize: 15, color: '#333' },
    footer: {
        backgroundColor: '#fff',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 10,
    },
    button: {
        flex: 1,
        marginHorizontal: 5,
    },

});

export default AdvanceFilter;