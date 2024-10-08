import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Grid, Card, CardMedia, CardContent, Typography, CardActionArea } from '@mui/material';
import QueryDataFetch from "../Services/FetchQueryData"; 
import UploadedTimeCalculate from "../utils/TimeDisplay";

function SearchResultDisplay() {
    const { Query } = useParams();
    const [results, setResults] = useState([]);
    const [Loading, SetLoading] = useState(false);
    const [Page, SetPage] = useState(1);

    useEffect(() => {
        FetchData(); // Fetch initial data when the query changes
        SetPage(1); // Reset page when a new search query is made
    }, [Query]);

    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.scrollHeight - 20 && !Loading) {
                SetPage(prevPage => prevPage + 1); // Increment page when the bottom is reached
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll); // Cleanup event listener on component unmount
        };
    }, [Loading]);

    useEffect(() => {
        if (Page > 1) {
            FetchMoreData(); // Fetch more data when the page number increases
        }
    }, [Page]);

    async function FetchMoreData() {
        SetLoading(true); // Set loading state
        try {
            const response = await QueryDataFetch(Page); // Fetch more data based on the current page
            const processedData = UploadedTimeCalculate(response); // Process the fetched response
            setResults(prevData => [...prevData, ...processedData]); // Append new data to existing data
        } catch (error) {
            console.error("Error fetching more data:", error);
        } finally {
            SetLoading(false); // Reset loading state
        }
    }

    async function FetchData() {
        SetLoading(true); // Set loading state
        try {
            const response = await QueryDataFetch(Query); // Fetch the data for the current query
            console.log("response Query", response);
            const processedData = UploadedTimeCalculate(response); // Ensure you process the data similarly
            setResults(processedData); // Set the results
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            SetLoading(false); // Reset loading state
        }
    }

    return (
        <div className="flex flex-wrap gap-6 mt-[70px] ml-[15%] w-[80%] justify-center">
            {results.length > 0 ? (
                results.map((item, index) => (
                    <Card
                        sx={{
                            maxWidth: "360px",
                            boxShadow: "none",
                            borderRadius: "8px",
                            overflow: "hidden",
                            backgroundColor: "#fff",
                            display: "flex",
                            flexDirection: "column",
                        }}
                        key={index}
                    >
                        <CardActionArea>
                            <CardMedia
                                component="img"
                                height="200"
                                sx={{ objectFit: "cover" }}
                                image={item.snippet.thumbnails.high.url}
                                alt="Video thumbnail"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "http://example.com/default.jpg"; // Replace with your fallback URL
                                }}
                            />
                            <CardContent sx={{ padding: "12px" }}>
                                <Typography
                                    gutterBottom
                                    variant="h6"
                                    component="div"
                                    sx={{
                                        fontSize: "16px",
                                        fontWeight: "bold",
                                        lineHeight: "1.3",
                                        color: "#333",
                                        mb: 1,
                                    }}
                                >
                                    {item.snippet.title?.slice(0, 60) + (item.snippet.title?.length > 60 ? "..." : "")}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ fontSize: "14px", mb: 1 }}
                                >
                                    {item.snippet.channelTitle}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ fontSize: "12px" }}
                                >
                                    {item.timeAgo} {/* Ensure this field exists in your data */}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                ))
            ) : (
                <Typography variant="body1" sx={{ mt: 2 }}>
                    No data available.
                </Typography>
            )}
        </div>
    );
}

export default SearchResultDisplay;
