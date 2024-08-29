import tw from "twrnc";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import ImageViewer from "../app/ImageViewer";
import { useBookmarks } from "../context/BookmarkContext";
import UseDynamicStyles from "../context/UseDynamicStyles";
import { Text, View, Image, Dimensions, TouchableOpacity } from "react-native";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const containerHeight = windowHeight - 70;
const imageHeight = windowHeight * 0.3;

const SingleNews = ({ item }) => {
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState("");
  const { bookmarkedArticles, toggleBookmark } = useBookmarks();

  const dynamicStyles = UseDynamicStyles();

  const isBookmarked = bookmarkedArticles.some((a) => a.url === item.url);

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
    <View style={tw`relative w-[${windowWidth}px] h-[${containerHeight}px]`}>
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
                isBookmarked
                  ? tw`text-green-500 font-bold`
                  : dynamicStyles.textColor,
              ]}
            >
              {isBookmarked ? "🔖 Bookmarked" : "🔖 Bookmark"}
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

export default SingleNews;
