import React, {FunctionComponent} from "react";
import { View, Image, StyleSheet, Dimensions } from "react-native";
import { AppHeader } from "./app_header";
import ColorConstants from "../constants/color_constants";
const {height, width} = Dimensions.get('window');

type Props = {
    navigation: any,
    route: any,
} 


const ImageShow :FunctionComponent<Props> = ({navigation, route}) => {
    const {images} = route.params;
    return (
      <View style={styles.container}>
        <AppHeader
                navigate={() => navigation.goBack()} text={undefined} action={undefined}        />
        <Image
          style={styles.imageContainer}
          source={{uri: images}}
          resizeMode="cover"
        />
      </View>
    );
  };


  const styles = StyleSheet.create({
    container: {
        height: '100%',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        backgroundColor: ColorConstants.primaryWhite,
      },
      imageContainer: {
        height: height * 0.9,
        width: width,
        justifyContent: 'center',
        alignItems: 'center',
      },
  });


  export default ImageShow;