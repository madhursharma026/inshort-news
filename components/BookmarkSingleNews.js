import tw from "twrnc";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import ImageViewer from "../app/ImageViewer";
import { useBookmarks } from "../context/BookmarkContext";
import UseDynamicStyles from "../context/UseDynamicStyles";
import { Text, View, Image, Dimensions, TouchableOpacity } from "react-native";

const { height: windowHeight } = Dimensions.get("window");
const imageHeight = windowHeight * 0.3;

const BookmarkSingleNews = ({ item }) => {
  const router = useRouter();
  const { toggleBookmark } = useBookmarks();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState("");

  const dynamicStyles = UseDynamicStyles();

  const handleImagePress = (imageURI) => {
    setSelectedImageUri(imageURI);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleBookmarkPress = () => {
    toggleBookmark(item);
  };

  if (!item) {
    return null;
  }

  return (
    <View style={tw`relative w-full h-[${windowHeight}px]`}>
      <TouchableOpacity
        onPress={() => handleImagePress(item.urlToImage)}
        style={tw`bg-white`}
      >
        <Image
          source={{ uri: item.urlToImage }}
          style={tw`w-full h-[${imageHeight}px] object-cover`}
        />
      </TouchableOpacity>

      <View style={[tw`flex-1 p-4`, dynamicStyles.backgroundColor]}>
        <Text style={[tw`text-lg pb-2`, dynamicStyles.textColor]}>
          {item.title}
        </Text>
        <Text style={[tw`text-sm pb-2 font-light`, dynamicStyles.textColor]}>
          {item.description}
        </Text>

        <View style={tw`flex-row items-center justify-between`}>
          <Text style={dynamicStyles.textColor}>
            Short by{" "}
            <Text style={tw`font-bold`}>{item.author ?? "unknown"}</Text>
          </Text>

          <TouchableOpacity onPress={handleBookmarkPress} style={tw`p-2`}>
            <Text
              style={[
                tw`text-lg`,
                tw`text-red-500`, // Use Tailwind red color
              ]}
            >
              Remove Bookmark
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ImageViewer
        visible={isModalVisible}
        imageUri={selectedImageUri}
        onClose={handleCloseModal}
      />

      <View
        style={[
          tw`absolute bottom-0 w-full h-24 px-4 justify-center`,
          dynamicStyles.footerBackgroundColor,
        ]}
      >
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/LinkViewer",
              params: { LinkURL: item.url },
            })
          }
        >
          <Text style={[tw`text-base`, dynamicStyles.footerTextColor]}>
            {item?.readMoreContent?.slice(0, 60)}...
          </Text>
          <Text
            style={[tw`text-base font-bold`, dynamicStyles.footerTextColor]}
          >
            Read More
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BookmarkSingleNews;
