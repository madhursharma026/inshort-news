import {
  Text,
  View,
  Modal,
  Button,
  Alert,
  TextInput,
  Dimensions,
  TouchableOpacity,
  Image,
} from "react-native";
import tw from "twrnc";
import { Video } from "expo-av";
import { APIURL } from "../api/api";
import { useRouter } from "expo-router";
import ImageViewer from "../app/ImageViewer";
import React, { useRef, useState } from "react";
import { useBookmarks } from "../context/BookmarkContext";
import UseDynamicStyles from "../context/UseDynamicStyles";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const containerHeight = windowHeight - 70;
const imageHeight = windowHeight * 0.3;

const SingleNews = ({ item }) => {
  const video = useRef(null);
  const [status, setStatus] = useState({});
  const [videoError, setVideoError] = useState(false);

  const router = useRouter();
  const dynamicStyles = UseDynamicStyles();
  const [reportText, setReportText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState("");
  const { bookmarkedArticles, toggleBookmark } = useBookmarks();
  const [isReportModalVisible, setIsReportModalVisible] = useState(false);
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

  const handleReportPress = () => {
    setIsReportModalVisible(true); // Show the report modal
  };

  const handleSubmitReport = async () => {
    if (reportText.trim() === "") {
      Alert.alert(
        "Report",
        "Please enter a reason for reporting this article."
      );
      return;
    }

    try {
      const response = await fetch(APIURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            mutation CreateReport($createReportInput: CreateReportInput!) {
              createReport(createReportInput: $createReportInput) {
                id
                details
                newsId
              }
            }
          `,
          variables: {
            createReportInput: {
              details: reportText,
              newsId: item.id, // Adjust according to your GraphQL schema
            },
          },
        }),
      });

      const result = await response.json();

      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      Alert.alert("Report Submitted", "Thank you for your feedback.");
      setIsReportModalVisible(false);
      setReportText("");
    } catch (error) {
      Alert.alert("Error", "Failed to submit the report. Please try again.");
    }
  };

  const handleCancelReport = () => {
    setIsReportModalVisible(false); // Hide the report modal
    setReportText(""); // Clear the report text
  };

  const handleVideoError = () => {
    setVideoError(true); // Set videoError to true if there's an error loading the video
  };

  if (!item) {
    return null;
  }

  return (
    <View style={tw`relative w-[${windowWidth}px] h-[${containerHeight}px]`}>
      <View style={tw`bg-white`}>
        {videoError || !item.newsVideo ? (
          <Image
            source={{
              uri: "https://storage.googleapis.com/support-forums-api/attachment/message-223455524-4125100802620654799.jpg",
            }}
            style={tw`w-full h-[${imageHeight}px] object-cover`}
            resizeMode="cover"
          />
        ) : (
          <Video
            ref={video}
            style={tw`w-full h-[${imageHeight}px] object-cover`}
            source={{
              uri: item.newsVideo,
            }}
            useNativeControls
            resizeMode="contain"
            isLooping
            onPlaybackStatusUpdate={setStatus}
            onError={handleVideoError} // Handle video errors
          />
        )}
        <TouchableOpacity
          onPress={handleReportPress}
          style={tw`absolute top-2 right-2 bg-red-500 p-2 rounded-full`}
        >
          <Text style={tw`text-white text-xs font-bold`}>Report News</Text>
        </TouchableOpacity>
      </View>

      <View style={[tw`flex-1 p-4`, dynamicStyles.backgroundColor]}>
        <Text style={[tw`text-lg pb-2`, dynamicStyles.textColor]}>
          {item.title}
        </Text>
        <Text
          style={[tw`text-sm pb-2 font-light`, dynamicStyles.textColor]}
          numberOfLines={2}
        >
          {item.description}...
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
          <Text
            style={[tw`text-base`, dynamicStyles.footerTextColor]}
            numberOfLines={2}
          >
            {item?.readMoreContent}
          </Text>
          <Text
            style={[tw`text-base font-bold`, dynamicStyles.footerTextColor]}
          >
            Read More
          </Text>
        </TouchableOpacity>
      </View>

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

export default SingleNews;
