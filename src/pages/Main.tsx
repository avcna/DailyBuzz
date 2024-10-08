import { useEffect, useState } from "react";
import { api } from "../api/baseUrl";
import Navbar from "../components/Navbar";
import NewsCard from "../components/NewsCard";
import styled from "styled-components";
import Footer from "../components/Footer";
import { date_converter } from "../helpers/date_converter";
import { NewsWrapper } from "../components/NewsComponents";
import { NewsCardSkeleton } from "../components/NewsCardSkeleton";
import { ErrorPage } from "./Error";

const apiKey = import.meta.env.VITE_API_KEY;

const Section = styled.section`
  padding: 16px 44px;
`;

interface Article {
  author?: string;
  title?: string;
  urlToImg?: string;
  url?: string;
  publishedAt?: string;
}

const Main = () => {
  const [news, setNews] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const image = [
    "https://s.yimg.com/os/en-SG/blogs/singaporeshowbiz/Paparazzi-crowding-around-Britney-Spears.jpg",
    "https://asset.kompas.com/crops/YQrcfXdm304xoWSOn2yxjOxxFyQ=/0x168:5500x3834/750x500/data/photo/2022/01/11/61dd7a1b1e57e.jpg",
    "https://storage.nu.or.id/storage/post/16_9/mid/demo-peringatan-darurat-indonesia_1724325582.webp",
    "https://lamanjambi.com/wp-content/uploads/2022/03/70712_migor.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Jalan_MH_Thamrin_Menteng%2C_Jakarta_Pusat.jpg/640px-Jalan_MH_Thamrin_Menteng%2C_Jakarta_Pusat.jpg",
  ];

  const getRandomImage = (): string => {
    const randomIndex = Math.floor(Math.random() * image.length);
    return image[randomIndex];
  };

  const getTopNews = async () => {
    setLoading(true);
    try {
      const res = await api.get(`top-headlines?country=id&apiKey=${apiKey}`);
      setNews(res.data.articles);
    } catch (error: any) {
      setIsError(true);
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (keyword: string) => {
    setLoading(true);
    try {
      const res = await api.get(`everything?q=${keyword}&apiKey=${apiKey}`);
      setNews(res.data.articles);
    } catch (error) {
      console.log(error)
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTopNews();
  }, []);

  return (
    <>
      <Navbar handleSearch={handleSearch} />
      <Section>
        {loading ? (
          <NewsCardSkeleton />
        ) : isError ? (
          <ErrorPage />
        ) : (
          <NewsWrapper>
            {news.map((item, index) => {
              const date = date_converter(item?.publishedAt || "");
              return (
                <NewsCard
                  key={index}
                  author={item?.author || "Penulis Tidak Diketahui"}
                  title={item?.title || "Tanpa Judul"}
                  urlToImg={item.urlToImg ? item.urlToImg : getRandomImage()}
                  url={item?.url || ""}
                  date={date}
                />
              );
            })}
          </NewsWrapper>
        )}
      </Section>
      <Footer />
    </>
  );
};

export default Main;
