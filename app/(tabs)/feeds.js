import tw from "twrnc";
import { APIURL } from "@env";
import Carousel from "react-native-snap-carousel";
import React, { useState, useEffect } from "react";
import SingleNews from "../../components/SingleNews";
import { Dimensions, View, Text } from "react-native";
import { useLanguage } from "../../context/LanguageContext";
import UseDynamicStyles from "../../context/UseDynamicStyles";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const client = new ApolloClient({
  uri: APIURL,
  cache: new InMemoryCache(),
});

const GET_NEWS_BY_LANGUAGE_QUERY = gql`
  query GetNewsByLanguage($language: String!) {
    newsByLanguage(language: $language) {
      id
      url
      title
      author
      language
      sourceURL
      description
      publishedAt
      readMoreContent
      sourceURLFormate
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

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const { data } = await client.query({
          query: GET_NEWS_BY_LANGUAGE_QUERY,
          variables: { language },
        });
        setArticles(data.newsByLanguage);
        console.log(data.newsByLanguage);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [language]);

  const renderCarouselItem = ({ item, index }) => (
    <SingleNews item={item} index={index} />
  );

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
      <View style={[{ transform: [{ scaleY: -1 }] }]}>
        <Carousel
          vertical={true}
          layout={"stack"}
          sliderHeight={windowHeight}
          itemHeight={windowHeight}
          data={articles}
          renderItem={renderCarouselItem}
          firstItem={articles.length - 1}
        />
      </View>
    );
  };

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
