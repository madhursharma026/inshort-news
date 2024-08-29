import tw from "twrnc";
import React from "react";
import Carousel from "react-native-snap-carousel";
import { Text, View, Dimensions } from "react-native";
import { useBookmarks } from "../../context/BookmarkContext";
import UseDynamicStyles from "../../context/UseDynamicStyles";
import BookmarkSingleNews from "../../components/BookmarkSingleNews";

const { height: windowHeight } = Dimensions.get("window");

const BookmarkNews = () => {
  const dynamicStyles = UseDynamicStyles();
  const { bookmarkedArticles } = useBookmarks();

  return (
    <View style={[tw`flex-1`, dynamicStyles.backgroundColor]}>
      {bookmarkedArticles.length === 0 ? (
        <View style={tw`flex-1 justify-center items-center`}>
          <Text style={[tw`text-lg font-bold`, dynamicStyles.textColor]}>
            There are no bookmarks
          </Text>
        </View>
      ) : (
        <Carousel
          vertical
          firstItem={0}
          layout="default"
          itemHeight={windowHeight}
          sliderHeight={windowHeight}
          containerCustomStyle={tw`flex-1`}
          data={bookmarkedArticles.slice().reverse()}
          renderItem={({ item, index }) => (
            <BookmarkSingleNews item={item} index={index} />
          )}
        />
      )}
    </View>
  );
};

export default BookmarkNews;
