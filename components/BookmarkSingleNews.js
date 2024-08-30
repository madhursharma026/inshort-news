import tw from "twrnc";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import ImageViewer from "../app/ImageViewer";
import { useBookmarks } from "../context/BookmarkContext";
import UseDynamicStyles from "../context/UseDynamicStyles";
import {
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
  Alert,
} from "react-native";

const { height: windowHeight } = Dimensions.get("window");
const imageHeight = windowHeight * 0.3;

const BookmarkSingleNews = ({ item }) => {
  const router = useRouter();
  const { toggleBookmark } = useBookmarks();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState("");
  const [reportText, setReportText] = useState(""); // State to store report text
  const [isReportModalVisible, setIsReportModalVisible] = useState(false); // State to control modal visibility

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

  const handleReportPress = () => {
    setIsReportModalVisible(true); // Show the report modal
  };

  const handleSubmitReport = () => {
    if (reportText.trim() === "") {
      Alert.alert(
        "Report",
        "Please enter a reason for reporting this article."
      );
      return;
    }
    // Handle report submission here (e.g., send report to the server)
    Alert.alert("Report Submitted", "Thank you for your feedback.");
    setIsReportModalVisible(false);
    setReportText(""); // Clear the report text
  };

  const handleCancelReport = () => {
    setIsReportModalVisible(false); // Hide the report modal
    setReportText(""); // Clear the report text
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
        <TouchableOpacity
          onPress={handleReportPress}
          style={tw`absolute top-2 right-2 bg-red-500 p-2 rounded-full`}
        >
          <Text style={tw`text-white text-xs font-bold`}>Report News</Text>
        </TouchableOpacity>
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

      {/* Report Modal */}
      <Modal
        visible={isReportModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCancelReport}
      >
        <View
          style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}
        >
          <View style={tw`bg-white p-6 rounded-lg w-4/5`}>
            <Text style={tw`text-lg font-bold mb-4`}>Report Article</Text>
            <TextInput
              style={tw`border border-gray-300 p-3 mb-4 rounded text-base h-32`}
              placeholder="Enter your reason for reporting"
              value={reportText}
              onChangeText={setReportText}
              multiline
              textAlignVertical="top"
            />

            <View style={tw`flex-row justify-between`}>
              <Button title="Cancel" onPress={handleCancelReport} />
              <Button title="Submit" onPress={handleSubmitReport} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default BookmarkSingleNews;
