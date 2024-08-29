import {
  CATEGORIES,
  VACCINE_IMAGE_URL,
  VACCINE_NOTIFICATION,
} from "../../api/api";
import tw from "twrnc";
import React from "react";
import Carousel from "react-native-snap-carousel";
import UseDynamicStyles from "../../context/UseDynamicStyles";
import { Text, View, Image, ScrollView, Dimensions } from "react-native";

const sources = Array(8).fill({
  pic: VACCINE_IMAGE_URL,
  notification: VACCINE_NOTIFICATION,
});

const DiscoverScreen = () => {
  const dynamicStyles = UseDynamicStyles();
  const windowWidth = Dimensions.get("window").width;
  const SLIDE_WIDTH = Math.round(windowWidth / 3.5);

  // Render item for category carousel
  const renderCategoryItem = ({ item }) => (
    <View style={tw`m-2.5 h-32 items-center justify-evenly`}>
      <Image
        source={{ uri: item.pic }}
        style={tw`h-3/5 w-full object-contain`}
      />
      <Text style={[tw`text-sm capitalize`, dynamicStyles.textColor]}>
        {item.name}
      </Text>
    </View>
  );

  // Render notifications with images
  const renderNotifications = (notifications) =>
    notifications.map((s, index) => (
      <View key={index} style={tw`mt-2.5 flex-row items-center px-10`}>
        <Text style={[tw`text-sm leading-4`, dynamicStyles.textColor]}>
          {s.notification.slice(0, 120)}...
        </Text>
        <Image source={{ uri: s.pic }} style={tw`w-15 h-15 ml-2.5`} />
      </View>
    ));

  return (
    <ScrollView
      contentContainerStyle={[
        tw`p-2.5 items-center`,
        dynamicStyles.backgroundColor,
      ]}
    >
      <Text
        style={[
          tw`text-2xl pb-2 rounded-xl font-bold mx-1.5 self-start`,
          dynamicStyles.textColor,
        ]}
      >
        Categories
      </Text>
      <Carousel
        layout="default"
        data={CATEGORIES}
        renderItem={renderCategoryItem}
        sliderWidth={windowWidth}
        itemWidth={SLIDE_WIDTH}
        activeSlideAlignment="start"
        inactiveSlideScale={1}
        inactiveSlideOpacity={1}
      />

      <Text
        style={[
          tw`text-2xl pb-2 rounded-xl font-bold mx-1.5 self-start`,
          dynamicStyles.textColor,
        ]}
      >
        Notifications
      </Text>
      {renderNotifications(sources)}

      <Text
        style={[
          tw`text-2xl pb-2 rounded-xl font-bold mx-1.5 self-start mt-10`,
          dynamicStyles.textColor,
        ]}
      >
        More Categories
      </Text>
      <Carousel
        layout="default"
        data={CATEGORIES}
        renderItem={renderCategoryItem}
        sliderWidth={windowWidth}
        itemWidth={SLIDE_WIDTH}
        activeSlideAlignment="start"
        inactiveSlideScale={1}
        inactiveSlideOpacity={1}
      />

      <Text
        style={[
          tw`text-2xl pb-2 rounded-xl font-bold mx-1.5 self-start`,
          dynamicStyles.textColor,
        ]}
      >
        More Notifications
      </Text>
      {renderNotifications(sources)}
    </ScrollView>
  );
};

export default DiscoverScreen;
