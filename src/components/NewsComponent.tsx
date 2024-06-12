import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import rssParser, { RSSItem } from "react-native-rss-parser";

const NewsComponent: React.FC = () => {
  const [latestArticles, setLatestArticles] = useState<RSSItem[]>([]);

  useEffect(() => {
    const fetchLatestArticles = async (url: string) => {
      try {
        const response = await fetch(url);
        const responseData = await response.text();
        const rss = await rssParser.parse(responseData);
        // Pridobi samo prva dva članka (najnovejša)
        const sortedArticles = rss.items.sort((a, b) => {
          const dateA = new Date(a.published).getTime();
          const dateB = new Date(b.published).getTime();
          return dateB - dateA;
        });
        setLatestArticles(sortedArticles.slice(0, 2));
      } catch (error) {
        console.error("Error fetching or parsing RSS feed:", error);
      }
    };

    fetchLatestArticles("https://www.modernsalon.com/rss");
  }, []);

  const openArticleLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Latest Articles from Modern Salon</Text>
      {latestArticles.map((article, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => openArticleLink(article.links[0].url)}
        >
          <View style={styles.articleContainer}>
            <Text style={styles.title}>{article.title}</Text>
            <Text style={styles.published}>{article.published}</Text>
            <Text style={styles.description}>{article.description}</Text>
            <Text style={styles.readMore}>Read More</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  heading: {
    fontSize: 23,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000",
  },
  articleContainer: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  published: {
    color: "#666",
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
  },
  readMore: {
    color: "blue",
    textDecorationLine: "underline",
    marginTop: 5,
  },
});

export default NewsComponent;
