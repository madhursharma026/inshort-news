import tw from "twrnc";
import { APIURL } from "../../api/api";
import Carousel from "react-native-snap-carousel";
import React, { useState, useEffect } from "react";
import SingleNews from "../../components/SingleNews";
import { Dimensions, View, Text } from "react-native";
import { useLanguage } from "../../context/LanguageContext";
import UseDynamicStyles from "../../context/UseDynamicStyles";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

// Apollo Client setup
const client = new ApolloClient({
  uri: APIURL,
  cache: new InMemoryCache(),
});

// GraphQL query for fetching news by language
const GET_NEWS_BY_LANGUAGE_QUERY = gql`
  query GetNewsByLanguage($language: String!) {
    newsByLanguage(language: $language) {
      id
      author
      description
      publishedAt
      readMoreContent
      title
      url
      newsVideo
      language
    }
  }
`;

const FeedsScreen = () => {
  const { language } = useLanguage();
  const dynamicStyles = UseDynamicStyles();
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const windowHeight = Dimensions.get("window").height;

  // Fetch articles based on the selected language
  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const { data } = await client.query({
          query: GET_NEWS_BY_LANGUAGE_QUERY,
          variables: { language },
        });
        setArticles(data.newsByLanguage);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [language]);

  // Render individual carousel item
  const renderCarouselItem = ({ item, index }) => (
    <SingleNews item={item} index={index} />
  );

  // Handle the main content rendering logic
  const renderContent = () => {
    if (loading) {
      return <StatusMessage message="Loading articles..." />;
    }
    if (error) {
      return <StatusMessage message={`Error: ${error}`} />;
    }
    if (articles.length === 0) {
      return <StatusMessage message="No articles available" />;
    }

    return (
      <Carousel
        layout="default"
        data={articles}
        sliderHeight={windowHeight}
        itemHeight={windowHeight}
        vertical
        renderItem={renderCarouselItem}
        inactiveSlideScale={1}
        inactiveSlideOpacity={1}
      />
    );
  };

  // Display status messages (loading, error, empty states)
  const StatusMessage = ({ message }) => (
    <Text style={[tw`text-lg text-center`, dynamicStyles.textColor]}>
      {message}
    </Text>
  );

  return (
    <View
      style={[
        tw`flex-1 justify-center items-center`,
        dynamicStyles.backgroundColor,
      ]}
    >
      {renderContent()}
    </View>
  );
};

export default FeedsScreen;
