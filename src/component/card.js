import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
const {width, height} = Dimensions.get('window');
import AntDesign from 'react-native-vector-icons/AntDesign';
// import AsyncStorage from '@react-native-async-storage/async-storage';



const Card = ({image,name,price,stock,onDelete}) => {
  
  return (
    <View style={styles.mainContainer}>
      <View style={styles.imageBox}>
        <Image
          source={typeof image === 'number' ? image : { uri: image }}
          style={styles.imageStyle}
          resizeMode='contain'
        />
        <TouchableOpacity style={styles.deleteBox} onPress={onDelete}>
        <AntDesign name="delete" size={25} color="black" />
        </TouchableOpacity>
      </View>
      <View>
        <Text style={styles.name}>{name}</Text>
        {stock &&<Text style={styles.stock}>.{stock}</Text>}
        <Text style={styles.price}>{price}</Text>
      </View>
    </View>
  );
};

export default Card;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: 'white',
    marginHorizontal: width * 0.04,
    marginTop: height * 0.02,
    width: width * 0.4,
    height: height * 0.25,
  },
  imageBox: {
    backgroundColor: 'lightgray',
    flexDirection: 'row',
    width: width * 0.4,
    height: height * 0.17,
    borderRadius: 10,
  },
  imageStyle: {
    height: height * 0.15,
    width: width * 0.25,
    alignSelf: 'center',
    marginHorizontal: width * 0.08,
    borderRadius:10
  },
  deleteBox: {
    position: 'absolute',
    right: 5,
    top: 5,
  },
  name: {
    color: 'black',
    fontWeight:'bold',
    marginLeft: width * 0.005,
    marginTop: height * 0.005,
    fontSize: width * 0.03,
  },
  price: {
    color: 'gray',
    marginLeft: width * 0.005,
    marginTop: height * 0.005,
    fontSize: width * 0.03,
  },
  stock:{
    color:"green"
  }
});
