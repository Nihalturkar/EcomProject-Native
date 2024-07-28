import { View, Text, StyleSheet, Dimensions, StatusBar, ScrollView, TouchableOpacity, TextInput, FlatList, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
const { width, height } = Dimensions.get("window");
import Ionicons from 'react-native-vector-icons/Ionicons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Card from '../../component/card';
import Modal from "react-native-modal";
import { RNToasty } from 'react-native-toasty'
import ImagePicker from 'react-native-image-crop-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';


const accesories = [
    {
        id: 1,
        image: require('../../assests/icons/product.jpeg'),
        name: 'AIAIAI 3.5mm Jack 2m',
        price: '$25.00',
    },
    {
        id: 2,
        image: require('../../assests/icons/product.jpeg'),
        name: 'AIAIAI 3.5mm Jack 1.5mm',
        price: '$15.00',
    },
];

const Home = ({ navigation,setToken }) => {
    const [visible, setVisible] = useState(false);
    const [products, setProducts] = useState([]);
    const [accessories, setAccessories] = useState([]);
    const [isModalVisible, setModalVisible] = useState(false);
    const [showForm, setShowForm] = useState(null);
    const [newItemName, setNewItemName] = useState('');
    const [newItemPrice, setNewItemPrice] = useState('');
    const [newItemImage, setNewItemImage] = useState(null);
    const [searchText, setSearchText] = useState('');


    // logout 

    const handleLogout = async () => {
        try {
          await AsyncStorage.removeItem('userToken');
          setToken(false);
          RNToasty.Success({
            title: `User LoggedOut successfully !`,
            position: 'bottom'
          });
          navigation.navigate('Login');
        } catch (e) {
          console.log(e);
        }
      };

    // adding image 
    const pickImage = () => {
        ImagePicker.openPicker({
            width: 300,
            height: 300,
            cropping: true
        }).then(image => {
            setNewItemImage(image.path);
        }).catch(error => {
            console.log('ImagePicker Error: ', error)
        });
    };


    // adding new item

    const addNewItem = () => {
        if (!newItemName || !newItemPrice) {
          RNToasty.Error({
            title: 'Please enter all data',
            position: 'top'
          });
          return;
        }
      
        const newItem = {
          id: Date.now(),
          name: newItemName,
          price: `$${newItemPrice}`,
          image: newItemImage ? { uri: newItemImage } : require('../../assests/icons/product.jpeg'),
        };
      
        // checking duplicate product
        if (showForm === 'product') {
          const existingProduct = products.find((product) => product.name === newItemName);
          if (existingProduct) {
            RNToasty.Error({
              title: 'Product already exists',
              position: 'top'
            });
            return;
          }
          setProducts((prevProducts) => [...prevProducts, newItem]);
          saveProduct(newItem);
        } else {
            // checking duplicate accessories
          const existingAccessory = accessories.find((accessory) => accessory.name === newItemName);
          if (existingAccessory) {
            RNToasty.Error({
              title: 'Accessory already exists',
              position: 'top'
            });
            return;
          }
          setAccessories((prevAccessories) => [...prevAccessories, newItem]);
          saveAccessory(newItem);
        }
      
        RNToasty.Success({
          title: `${showForm === 'product' ? 'Product' : 'Accessory'} added successfully`,
          position: 'bottom'
        });
        toggleModal();
      };

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
        setShowForm(null);
        setNewItemName('');
        setNewItemPrice('');
        setNewItemImage(null);
    };

    useEffect(() => {
        loadProducts();
        loadAccessories();
    },[]);

    const loadProducts = async () => {
        try {
            const productsFromStorage = await AsyncStorage.getItem('products');
            if (productsFromStorage !== null) {
                setProducts(JSON.parse(productsFromStorage));
            } else {
                setProducts(accesories);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const loadAccessories = async () => {
        try {
            const accessoriesFromStorage = await AsyncStorage.getItem('accessories');
            if (accessoriesFromStorage !== null) {
                setAccessories(JSON.parse(accessoriesFromStorage));
            } else {
                setAccessories(accesories);
            }
        } catch (error) {
            console.log(error);
        }
    };



    const saveProduct = async (newProduct) => {
        try {
            const productsFromStorage = await AsyncStorage.getItem('products');
            if (productsFromStorage !== null) {
                const productsArray = JSON.parse(productsFromStorage);
                productsArray.push(newProduct);
                await AsyncStorage.setItem('products', JSON.stringify(productsArray));
            } else {
                await AsyncStorage.setItem('products', JSON.stringify([newProduct]));
            }
        } catch (error) {
            console.log(error);
        }
    };

    const saveAccessory = async (newAccessory) => {
        try {
            const accessoriesFromStorage = await AsyncStorage.getItem('accessories');
            if (accessoriesFromStorage !== null) {
                const accessoriesArray = JSON.parse(accessoriesFromStorage);
                accessoriesArray.push(newAccessory);
                await AsyncStorage.setItem('accessories', JSON.stringify(accessoriesArray));
            } else {
                await AsyncStorage.setItem('accessories', JSON.stringify([newAccessory]));
            }
        } catch (error) {
            console.log(error);
        }
    };

    const deleteProduct = async (productId) => {
        console.log(productId)
        try {
          const productsFromStorage = await AsyncStorage.getItem('products');
          if (productsFromStorage !== null) {
            const productsArray = JSON.parse(productsFromStorage);
            const filteredProducts = productsArray.filter((product) => product.id !== productId);
            await AsyncStorage.setItem('products', JSON.stringify(filteredProducts));
            setProducts(filteredProducts);
            RNToasty.Success({
                title: `${showForm === 'product' ? 'Product' : 'Accessory'} Delete successfully`,
                position: 'top'
            });
          }
        } catch (error) {
          console.log(error);
        }
      };

    const deleteAccessory = async (accessoryId) => {
        try {
            const accessoriesFromStorage = await AsyncStorage.getItem('accessories');
            if (accessoriesFromStorage !== null) {
                const accessoriesArray = JSON.parse(accessoriesFromStorage);
                const filteredAccessories = accessoriesArray.filter((accessory) => accessory.id !== accessoryId);
                await AsyncStorage.setItem('accessories', JSON.stringify(filteredAccessories));
                setAccessories(filteredAccessories)
                RNToasty.Success({
                    title: `${showForm === 'product' ? 'Product' : 'Accessory'} Delete successfully`,
                    position: 'top'
                });
            }
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor='white' barStyle='dark-content' />
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.inner}>
                    <View style={styles.topcontainer}>
                        <TouchableOpacity style={styles.icons} onPress={handleLogout}>
                            <Ionicons name='chevron-back' size={30} color='gray' />
                        </TouchableOpacity>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            {visible &&
                             <TextInput
                             placeholder='Search products'
                             value={searchText}
                             onChangeText={(text) => setSearchText(text)}
                             style={styles.input}
                             placeholderTextColor='gray'
                           />
                            }
                            <TouchableOpacity style={styles.icons} onPress={() => setVisible(!visible)}>
                                <Ionicons name='search' size={30} color='gray' />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <Text style={styles.title}>
                        Hi-Fi Shop & Service
                    </Text>
                    <Text style={styles.shopDetail}>
                        Audio shop on Rustaveli Ave 57 {'\n'}
                        This shop offers both products and services
                    </Text>

                    {/* Product */}
                    <View style={styles.productsBox}>
                        <Text style={styles.products}>
                            Products
                            <Text style={styles.length}> {products.length}</Text>
                        </Text>
                        <TouchableOpacity>
                            <Text style={styles.showAll}>Show all</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ width: width * 1 }}>
                        {products.length > 0 ? (
                            <FlatList
                            data={products.filter((product) => product.name.toLowerCase().includes(searchText.toLowerCase()))}
                                horizontal
                                keyExtractor={item => item.id.toString()}
                                renderItem={({ item }) => (
                                    <Card
                                        image={item.image ? (typeof item.image === 'number' ? item.image : item.image.uri) : null}
                                        name={item.name}
                                        price={item.price}
                                        onDelete={()=>deleteProduct(item.id)}
                                    />
                                )}
                                showsHorizontalScrollIndicator={false}
                            />
                        ) : (
                            <View style={{ alignItems: 'center' }}>
                                <Text style={styles.noProduct}>No Product Found</Text>
                            </View>
                        )}
                    </View>

                    {/* Accessories */}
                    <View style={styles.productsBox}>
                        <Text style={styles.products}>
                            Accessories
                            <Text style={styles.length}> {accessories.length}</Text>
                        </Text>
                        <TouchableOpacity>
                            <Text style={styles.showAll}>Show all</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ width: width * 1 }}>
                        {accessories.length > 0 ? (
                            <FlatList
                            data={accessories.filter((accessory) => accessory.name.toLowerCase().includes(searchText.toLowerCase()))}
                                horizontal
                                keyExtractor={item => item.id.toString()}
                                renderItem={({ item }) => (
                                    <Card
                                        image={item.image ? (typeof item.image === 'number' ? item.image : item.image.uri) : null}
                                        name={item.name}
                                        price={item.price}
                                        stock='Available'
                                        onDelete={()=>deleteAccessory(item.id)}
                                    />
                                )}
                                showsHorizontalScrollIndicator={false}
                            />
                        ) : (
                            <View style={{ alignItems: 'center' }}>
                                <Text style={styles.noProduct}>No Accessories Found</Text>
                            </View>
                        )}
                    </View>
                    <View>
                        <TouchableOpacity
                            style={styles.addIcon} onPress={() => setModalVisible(true)}>
                            <AntDesign name="pluscircle" size={50} color="#1e7df0" />
                        </TouchableOpacity>
                    </View>

                    {/* MODAL CONTAINER  */}
                    <Modal
                        isVisible={isModalVisible}
                        onBackdropPress={() => setModalVisible(false)}
                        onBackButtonPress={() => setModalVisible(false)}
                    >
                        <View style={styles.modalContainer}>
                            {!showForm ? (
                                <>
                                    <Text style={styles.modalTitle}>Choose an option:</Text>
                                    <TouchableOpacity style={styles.modalButton} onPress={() => setShowForm('product')}>
                                        <Text style={styles.modalButtonText}>Add Product</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.modalButton} onPress={() => setShowForm('accessory')}>
                                        <Text style={styles.modalButtonText}>Add Accessory</Text>
                                    </TouchableOpacity>
                                </>
                            ) : (
                                <>
                                    <Text style={styles.modalTitle}>{showForm === 'product' ? 'Add Product' : 'Add Accessory'}</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Name"
                                        value={newItemName}
                                        placeholderTextColor='gray'
                                        onChangeText={setNewItemName}
                                    />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Price"
                                        value={newItemPrice}
                                        placeholderTextColor='gray'
                                        onChangeText={setNewItemPrice}
                                        keyboardType="numeric"
                                    />
                                    <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
                                        <Text style={styles.imagePickerButtonText}>
                                            {newItemImage ? 'Change Image' : 'Pick an Image'}
                                        </Text>
                                    </TouchableOpacity>
                                    {newItemImage && (
                                        <Image source={{ uri: newItemImage }} style={styles.previewImage} />
                                    )}
                                    <TouchableOpacity style={styles.addButton} onPress={addNewItem}>
                                        <Text style={styles.addButtonText}>Add {showForm === 'product' ? 'Product' : 'Accessory'}</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                    </Modal>
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    inner: {
        width: width * .9,
        alignSelf: 'center'
    },
    topcontainer: {
        width: width * .9,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: height * .04
    },
    icons: {
        backgroundColor: 'lightgray',
        padding: width * .02,
        borderRadius: 10
    },
    input: {
        color: '#000',
        borderBottomWidth: .5,
        fontSize: width * .035,
    },
    title: {
        color: "black",
        fontSize: width * .05,
        fontWeight: 'bold',
        marginLeft: width * .04,
        marginTop: height * .04,
    },
    shopDetail: {
        color: 'lightgray',
        fontSize: width * .035,
        marginLeft: width * 0.05,
        marginTop: height * 0.03,
    },
    productsBox: {
        width: width * .9,
        flexDirection: 'row',
        marginLeft: width * 0.05,
        marginTop: height * 0.03,
        justifyContent: 'space-between',
        // backgroundColor: 'red',
        alignItems: 'center',
    },
    products: {
        color: 'black',
        fontWeight: '500',
        fontSize: width * 0.05,
        marginRight: width * .04,
    },
    length: {
        color: 'lightgray',
        fontSize: width * 0.045,
    },
    showAll: {
        color: 'blue',
        fontWeight: '600',
        fontSize: width * 0.035,
        marginRight: width * 0.04,
    },
    noProduct: {
        color: 'black',
        fontSize: width * 0.04,
        marginVertical: height * 0.1,
    },
    addIcon: {
        alignSelf: 'flex-end',
        marginTop: height * 0.001,
        marginRight: width * 0.04,
    },

    // modal
    modalContainer: {
        backgroundColor: 'white',
        padding: width * .04,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        width:width*1,
        height:height*1,
        alignSelf:'center'
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        color: 'black'
    },
    modalButton: {
        backgroundColor: '#2196F3',
        padding: 10,
        margin: 10,
        borderRadius: 5,
    },
    modalButtonText: {
        color: 'white',
        textAlign: 'center',
    },
    input: {
        width: width * .7,
        borderBottomWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        color: 'black'
    },
    addButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        marginTop: 10,
        borderRadius: 5,
    },
    addButtonText: {
        color: 'white',
        textAlign: 'center',
    },
    imagePickerButton: {
        backgroundColor: '#3498db',
        padding: 10,
        marginTop: 10,
        borderRadius: 5,
    },
    imagePickerButtonText: {
        color: 'white',
        textAlign: 'center',
    },
    previewImage: {
        width: 100,
        height: 100,
        marginTop: 10,
        borderRadius: 5,
    },
})

export default Home