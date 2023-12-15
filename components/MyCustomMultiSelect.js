import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, FlatList } from 'react-native';


const MyCustomMultiSelect = ({ data, onSelect, max, title }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);

    const handleSelectItem = (item) => {
        const itemLabel = item.label;
        if (selectedItems.includes(itemLabel)) {
            setSelectedItems(selectedItems.filter(label => label !== itemLabel));
        } else {
            if (selectedItems.length < max) {
                setSelectedItems([...selectedItems, itemLabel]);
            } 
            // else {
            //     alert(`You can only select up to ${max} interests.`);
            // }
        }
    };

    const removeSelectedItem = (itemLabel) => {
        setSelectedItems(selectedItems.filter(label => label !== itemLabel));
    };


    const renderItem = ({ item }) => (
        <TouchableOpacity 
            onPress={() => handleSelectItem(item)} 
            style={styles.item}
        >
            <Text 
                style={[
                    styles.itemText, 
                    selectedItems.includes(item.value) ? styles.selectedItem : null
                ]}
            >
                {item.label}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View>
            <Text style={styles.dropdownInfoText}>{title}</Text>
            <TouchableOpacity onPress={() => setIsVisible(true)} style={styles.dropdownButton} activeOpacity={0.8}>
                <Text style={styles.dropdownText}>Select {title}...</Text>
            </TouchableOpacity>

            {/* Display selected items */}
            <View style={styles.selectedItemsContainer}>
                {selectedItems.map((item, index) => (
                    <View key={index} style={styles.selectedItem}>
                        <Text style={styles.selectedItemText}>{item}</Text>
                        <TouchableOpacity onPress={() => removeSelectedItem(item)}>
                            <Text style={styles.removeIcon}> x </Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>

            <Modal
                transparent={true}
                visible={isVisible}
                onRequestClose={() => setIsVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalContainer}
                    activeOpacity={1}
                    onPressOut={() => {
                        setIsVisible(false);
                        onSelect(selectedItems);
                    }}
                >
                    <View style={styles.modalContent}>
                        <FlatList
                            data={data}
                            keyExtractor={item => item.value}
                            renderItem={renderItem}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    dropdownInfoText:{
        fontSize:20,
        color:"#B7B7B7",
        marginVertical:0
    },
    dropdownButton: {
        width:350,
        height:55,
        borderWidth:1,
        borderRadius:15,
        marginVertical:10,
        color:"#B7B7B7",
        borderColor:"#4C4C4C",
        paddingLeft:20,
        fontSize:15,
        justifyContent:"center",
    },
    dropdownText: {
        fontSize: 15,
        color:"#4C4C4C",
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: '#272727',
        padding: 15,
        borderRadius: 15,
        width:350,
        height:250  
    },
    item: {
        padding: 15,
    },
    itemText: {
        fontSize: 16,
        color:"#B7B7B7",
    },
    selectedItemsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width:350,
        justifyContent:"center",
        alignItems:"center"
    },
    selectedItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#272727',
        borderRadius: 10,
        padding: 8,
        marginRight: 5,
        marginBottom: 5,
        alignItems:"center"
    },
    selectedItemText: {
        marginRight: 5,
        color:"#B7B7B7",
        // Style as needed
    },
    removeIcon: {
        color: 'red',
        fontSize: 20,
    },
});

export default MyCustomMultiSelect;
