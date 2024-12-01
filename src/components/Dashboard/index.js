import React, {useEffect, useState} from 'react';
import CountTile from '../CountTile';
import CountTile2 from '../CountTile2';
import {Grid2, Box, Card, CardContent, Typography, Snackbar} from '@mui/material';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import PeopleIcon from '@mui/icons-material/People';
import Highcharts from 'highcharts';
import axios from 'axios';

const Dashboard = () => {

    const [fileCount,
        setFileCount] = useState('00');
    const [peerCount,
        setPeerCount] = useState('00');
    const [videosCount,
        setVideosCount] = useState('00');
    const [photosCount,
        setPhotosCount] = useState('00');
    const [othersCount,
        setOthersCount] = useState('00');
    const [loading,
        setLoading] = useState(true);

    useEffect(() => {
        loadDataForDashboard();
        // getDashboardData();
    }, []);

    const getDashboardData = async() => {
        try {
            const response = await axios.get('http://localhost:5000/dashboard/file-stats');
            return response.data.data;
        } catch (err) {
            console.error("Failed to fetch files:", err);
        }
    }

    const loadDataForDashboard = async() => {
        let data = await getDashboardData();
        console.log(data, '3333');
        setFileCount(formatNumber(data.files_count));
        setPeerCount(formatNumber(data.peers_count));
        setOthersCount(formatNumber(data.file_types.others));
        setVideosCount(formatNumber(data.file_types.videos));
        setPhotosCount(formatNumber(data.file_types.photos));
        setLoading(false);
        const filesData = data.files_with_timestamp;
        const userData = data.peer_cid_array;

        // Group by month-year
        const groupedData = filesData.reduce((acc, {timestamp}) => {
            const monthYear = new Date(timestamp).toLocaleString('en-US', {
                month: 'short',
                year: 'numeric'
            });
            acc[monthYear] = (acc[monthYear] || 0) + 1;
            return acc;
        }, {});

        // Prepare the chart data
        const labels = Object.keys(groupedData);
        const fileCounts = Object.values(groupedData);

        // Highcharts options
        const columnChartOptions = {
            chart: {
                type: 'column',
                height: 350,
                backgroundColor: 'transparent', // Transparent background
            },
            title: {
                text: null, // Remove the title
            },
            xAxis: {
                categories: labels,
                title: {
                    text: null,
                    style: {
                        fontSize: '12px',
                        color: '#666', // Neutral gray text for x-axis title
                    }
                },
                labels: {
                    style: {
                        color: '#666', // Neutral gray text for x-axis labels
                        fontSize: '12px'
                    }
                },
                gridLineWidth: 0, // Remove gridlines
                lineColor: '#eee', // X-axis line color
            },
            yAxis: {
                title: {
                    text: 'Files Uploaded',
                    style: {
                        fontSize: '12px',
                        color: '#666', // Neutral gray text for y-axis title
                    }
                },
                labels: {
                    style: {
                        color: '#666', // Neutral gray text for y-axis labels
                        fontSize: '12px'
                    }
                },
                gridLineWidth: 0, // Remove gridlines
                lineColor: '#eee', // Add a visible line for y-axis
            },
            series: [
                {
                    name: "Files Uploaded",
                    data: fileCounts,
                    color: 'rgb(95,158,160)', // Uniform blue color for columns
                }
            ],
            legend: {
                enabled: false, // Hide the legend
            },
            tooltip: {
                valueSuffix: ' files'
            },
            credits: {
                enabled: false, // Hide Highcharts watermark
            },
            plotOptions: {
                column: {
                    dataLabels: {
                        enabled: false, // Data labels disabled as per request
                    }
                }
            }
        };

        let columnChart = document.getElementById('fileUploadChart');
        
        if (columnChart) {
           // Render Highcharts
           Highcharts.chart('fileUploadChart', columnChartOptions);
        }


        // Transform userData to group by peerID and count the files (CIDs)
        const peerData = userData.reduce((acc, {CID, peerID}) => {
            acc[peerID] = (acc[peerID] || 0) + 1; // Count CIDs for each peerID
            return acc;
        }, {});

        // Generate friendly labels for each peer
        const peerLabels = Object
            .keys(peerData)
            .map((peerID, index) => ({
                id: peerID,
                label: `Peer ${index + 1}`
            }));

        // Prepare the donut chart data with friendly labels
        const donutChartData = peerLabels.map(({id, label}) => ({
            name: label, // Friendly label (e.g., Peer 1, Peer 2)
            y: peerData[id], // Number of files uploaded by the peer
            peerID: id, // Include the actual peerID for tooltip
        }));

        const donutChartOptions = {
            chart: {
                type: 'pie',
                height: 350,
                backgroundColor: 'transparent'
            },
            title: {
                text: null, // No title
            },
            tooltip: {
                pointFormat: `
      <b>{point.name}</b><br>
      Files Uploaded: <b>{point.y}</b><br>
      Peer ID: <b>{point.peerID}</b>`, // Tooltip shows actual peerID and file count
            },
            plotOptions: {
                pie: {
                    innerSize: '50%', // Donut chart
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '{point.name}', // Show friendly label and file count
                    },
                    colors: [
                        '#1E90FF', '#4682B4', '#5F9EA0', '#87CEFA', '#B0E0E6'
                    ], // Shades of blue
                }
            },
            series: [
                {
                    name: 'Files', // Series name
                    colorByPoint: true,
                    data: donutChartData, // Pass the prepared data
                }
            ],
            credits: {
                enabled: false, // Hide Highcharts watermark
            }
        };

        let donutChart = document.getElementById('fileUploadDonutChart');

        if (donutChart) {
          // Render Highcharts
          Highcharts.chart('fileUploadDonutChart', donutChartOptions);
        }
        

    }

    function formatNumber(num) {
        return num < 10
            ? `0${num}`
            : `${num}`;
    }

    return (
        <Box sx={{
            marginTop: '16px'
        }}>
            <Grid2 container spacing={4}>
                <Grid2 item size={3}>
                    <CountTile
                        title={'Peers'}
                        count={peerCount}
                        color={'skyblue'}
                        icon={< PeopleIcon sx = {{ fontSize: 22, color: 'skyblue' }}/>}/>
                </Grid2>
                <Grid2 item size={3}>
                    <CountTile
                        title={'Files'}
                        count={fileCount}
                        color={'lightblue'}
                        icon={< LibraryBooksIcon sx = {{ fontSize: 22, color: 'skyblue' }}/>}/>
                </Grid2>
                <Grid2 item size={6}>
                    <CountTile2
                        title1={'Videos'}
                        count1={videosCount}
                        title2={'Images'}
                        count2={photosCount}
                        title3={'Others'}
                        count3={othersCount}
                        color={'rgb(70,130,180)'}
                        mainTitle={'Files:'}/>
                </Grid2>
            </Grid2>
            <Grid2
                container
                spacing={4}
                sx={{
                marginTop: '32px'
            }}>
                <Grid2 item size={6}>
                    <Card
                        sx={{
                        border: '2px solid #eee',
                        boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.2)'
                    }}>
                        <Typography
                            sx={{
                            fontSize: '16px',
                            fontWeight: 600,
                            padding: '20px'
                        }}>Files Uploaded Over Time:</Typography>
                        <CardContent sx={{height: '41vh'}}>
                            <Box id='fileUploadChart'/>
                        </CardContent>
                    </Card>
                </Grid2>
                <Grid2 item size={6}>
                    <Card
                        sx={{
                        border: '2px solid #eee',
                        boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.2)'
                    }}>
                        <Typography
                            sx={{
                            fontSize: '16px',
                            fontWeight: 600,
                            padding: '20px'
                        }}>Distribution of Files Uploaded by Users:</Typography>
                        <CardContent sx={{height: '41vh'}}>
                            <Box id='fileUploadDonutChart'/>
                        </CardContent>
                    </Card>
                </Grid2>
            </Grid2>
            <Snackbar open={loading} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} autoHideDuration={6000} message="Dashboard is loading, please wait"/>
        </Box>
    )
}

export default Dashboard;
