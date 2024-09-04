import {
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import tw from "twrnc";
import { APIURL } from "../../api/api";
import RenderHTML from "react-native-render-html";
import { useWindowDimensions } from "react-native";
import React, { useEffect, useState, useMemo } from "react";
import UseDynamicStyles from "../../context/UseDynamicStyles";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { useRouter } from "expo-router";

// Apollo Client setup
const client = new ApolloClient({
  uri: APIURL,
  cache: new InMemoryCache(),
});

const GET_NEWS_BY_LANGUAGE_QUERY = gql`
  query {
    articles {
      id
      title
      description
      imageURL
      createdAt
    }
  }
`;

const DiscoverScreen = () => {
  const router = useRouter();
  const dynamicStyles = UseDynamicStyles();
  const { width } = useWindowDimensions();
  const [error, setError] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleArticles, setVisibleArticles] = useState(2);

  const fetchArticles = async () => {
    try {
      const { data } = await client.query({
        query: GET_NEWS_BY_LANGUAGE_QUERY,
      });
      setArticles(data.articles || []);
      setError(null);
    } catch (err) {
      setError("Failed to load articles. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const articlesToShow = useMemo(
    () => articles.slice(0, visibleArticles),
    [articles, visibleArticles]
  );

  if (loading) {
    return (
      <View style={[tw`flex-1 justify-center`, dynamicStyles.backgroundColor]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={[
        tw`flex-grow p-2.5`,
        dynamicStyles.backgroundColor,
      ]}
    >
      <View style={[tw`flex-1 p-2.5`, dynamicStyles.backgroundColor]}>
        <View style={tw`justify-center items-center`}>
          <Text
            style={[
              tw`text-3xl pb-4 rounded-xl font-bold underline`,
              dynamicStyles.textColor,
            ]}
          >
            Articles
          </Text>
        </View>
        {error ? (
          <>
            <View style={tw`flex-1 justify-center mt-4`}>
              <Text style={tw`text-red-500 text-xl`}>{error}</Text>
            </View>
            <TouchableOpacity
              onPress={fetchArticles}
              style={tw`p-2.5 mt-8 bg-red-500 rounded-lg`}
            >
              <Text style={tw`text-white text-center font-semibold`}>
                Retry, Fetch Articles
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {articlesToShow.map((article) => (
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/SingleArticle",
                    params: {
                      title: article.title,
                      imageURL: article.imageURL,
                      description: article.description,
                    },
                  })
                }
              >
                <View
                  key={article.id}
                  style={tw`flex-col w-full border-b pb-3 mb-3 border-gray-300`}
                >
                  <View style={tw`flex-row items-start`}>
                    <View style={tw`flex-1`}>
                      <Text
                        style={[
                          tw`text-lg font-semibold mb-1`,
                          dynamicStyles.textColor,
                        ]}
                        numberOfLines={3}
                      >
                        {article?.title}
                      </Text>
                    </View>
                    <Image
                      source={{
                        uri:
                          article.imageURL ||
                          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVLDP5s2j9u1x86fOb7kNKXanJeMn8zZ30ZQ&s",
                      }}
                      style={tw`w-20 h-20 ml-4 rounded-md`}
                      resizeMode="cover"
                    />
                  </View>
                  <View style={tw`mt-2`}>
                    <RenderHTML
                      contentWidth={width}
                      source={{
                        html: `${
                          article?.description?.length > 120
                            ? `${article.description.slice(0, 120)}...`
                            : article.description || ""
                        }`,
                      }}
                      baseStyle={{
                        ...tw`text-base`,
                        ...dynamicStyles.textColor,
                      }}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
            {visibleArticles < articles.length && (
              <TouchableOpacity
                onPress={() => setVisibleArticles((prev) => prev + 2)}
                style={tw`p-2.5 bg-blue-500 rounded-lg`}
              >
                <Text style={tw`text-white text-center font-semibold`}>
                  More Articles
                </Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </ScrollView>
  );
};

export default DiscoverScreen;
