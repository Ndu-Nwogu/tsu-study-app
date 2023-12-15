import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, FlatList } from 'react-native';

const MyDropdown = ({ data, onSelect, placeholder, title }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const handleSelect = (item) => {
        setSelectedItem(item);
        setIsVisible(false);
        onSelect(item);
    };

    return (
        <View>
            <Text style={styles.dropdownInfoText}>{title}</Text>
            <TouchableOpacity onPress={() => setIsVisible(true)} style={styles.dropdownButton} activeOpacity={0.8}>
                <Text style={styles.dropdownText}>{selectedItem ? selectedItem.label : placeholder}</Text>
            </TouchableOpacity>

            <Modal
                transparent={true}
                visible={isVisible}
                onRequestClose={() => setIsVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalContainer}
                    activeOpacity={1}
                    onPressOut={() => setIsVisible(false)}
                >
                    <View style={styles.modalContent}>
                        <FlatList
                            data={data}
                            keyExtractor={item => item.value}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => handleSelect(item)} style={styles.item}>
                                    <Text style={styles.itemText}>{item.label}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
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
    dropdownInfoText:{
        fontSize:20,
        color:"#B7B7B7",
        marginVertical:0
    }
});

export default MyDropdown;
