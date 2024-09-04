import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import tw from "twrnc";
import React, { useState } from "react";
import ImageViewer from "../ImageViewer/index";
import RenderHTML from "react-native-render-html";
import Icon from "react-native-vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import UseDynamicStyles from "../../context/UseDynamicStyles";

const SingleArticle = () => {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const dynamicStyles = UseDynamicStyles();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState("");

  const handleImagePress = (imageURI) => {
    setSelectedImageUri(imageURI);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };
  const { title } = useLocalSearchParams();
  const { imageURL } = useLocalSearchParams();
  const { description } = useLocalSearchParams();

  return (
    <ScrollView style={[tw`flex-1 p-4`, dynamicStyles.backgroundColor]}>
      <View style={tw`flex-row justify-between items-center mb-4 mx-1`}>
        <TouchableOpacity onPress={() => router.back()}>
          <Icon
            name="arrow-back"
            size={24}
            color={dynamicStyles.textColor.color}
          />
        </TouchableOpacity>
      </View>

      <Text
        style={[
          tw`text-2xl font-bold mb-2 mx-1`,
          dynamicStyles.textColor,
          { textAlign: "justify" },
        ]}
      >
        {title}
      </Text>

      <TouchableOpacity
        onPress={() => handleImagePress(`${imageURL}`)}
        style={tw`bg-white`}
      >
        <Image
          source={{
            uri: `${imageURL}`,
          }}
          style={tw`w-full h-50`}
        />
      </TouchableOpacity>

      <RenderHTML
        contentWidth={width}
        source={{
          html: `${description}`,
        }}
        baseStyle={{
          ...tw`text-base mt-4 mb-8`,
          ...dynamicStyles.textColor,
        }}
      />

      <ImageViewer
        visible={isModalVisible}
        imageUri={selectedImageUri}
        onClose={handleCloseModal}
      />
    </ScrollView>
  );
};

export default SingleArticle;
