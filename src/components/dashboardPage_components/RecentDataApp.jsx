import React, { useState, useEffect, useContext, useCallback, useRef } from 'react';

// Styles
import styles from "../../sass/dashboardPage_styles/RecentDataApp.module.scss";

// React-Icons
import { IoFilter } from "react-icons/io5";

// MUI X-Charts
import { BarChart } from '@mui/x-charts/BarChart';

// Context & DB
import { AuthContext } from '../../context/AuthContext';
import vena_db from '../../config/supabaseClient';

const RecentDataApp = () => {
    // Popup Ref
    const popupRef = useRef(null);
    const filterButtonRef = useRef(null);

    // Current user data
    const { loggedUserData } = useContext(AuthContext);
    const userId = loggedUserData?.user_settings?.user_id || loggedUserData?.id;

    // Filter states
    const [selectedDataType, setSelectedDataType] = useState("BPM");
    const [selectedCalculationType, setSelectedCalculationType] = useState("Avg");
    const [isFilterPopupOpen, setIsFilterPopupOpen] = useState(false);

    // Data states
    const [rawDaysData, setRawDaysData] = useState([]);
    const [chartData, setChartData] = useState({ dates: [], values: [] });
    const [loading, setLoading] = useState(true);

    // Format ISO string to 'Jun 17' format
    const formatDateLabel = (isoDate) => {
        const date = new Date(isoDate);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    // Fetch the last available (up to 7) days of records from Supabase
    const fetchRecentRecords = useCallback(async () => {
        if (!userId) return;

        try {
            setLoading(true);

            // Fetch the most recent days first (max 7 rows)
            const { data, error } = await vena_db
                .from('pulse_oximeter')
                .select('measurement_id, created_at, measurement_data')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(7);

            if (error) throw error;

            if (data && data.length > 0) {
                // Reverse to display chronologically from left to right on the chart
                const chronologicalData = [...data].reverse();
                setRawDaysData(chronologicalData);
            } else {
                setRawDaysData([]);
            }
        } catch (error) {
            console.error("Supabase: Error fetching recent records:", error.message);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    // Recalculate chart metrics whenever raw data or active filter settings change
    useEffect(() => {
        if (!rawDaysData || rawDaysData.length === 0) {
            setChartData({ dates: [], values: [] });
            return;
        }

        const dates = [];
        const values = [];

        rawDaysData.forEach((dayRecord) => {
            const readings = dayRecord?.measurement_data?.readings;
            const dateStr = formatDateLabel(dayRecord.created_at);

            if (!Array.isArray(readings) || readings.length === 0) {
                dates.push(dateStr);
                values.push(0);
                return;
            }

            // Extract valid numerical values based on selectedDataType
            const key = selectedDataType === "BPM" ? 'bpm' : 'spo2';
            const validNumbers = readings
                .map((item) => item[key])
                .filter((val) => typeof val === 'number' && val > 0);

            if (validNumbers.length === 0) {
                dates.push(dateStr);
                values.push(0);
                return;
            }

            // Compute metric according to selectedCalculationType
            let computedValue = 0;
            if (selectedCalculationType === "Avg") {
                const sum = validNumbers.reduce((acc, curr) => acc + curr, 0);
                computedValue = Math.round(sum / validNumbers.length);
            } else if (selectedCalculationType === "Max") {
                computedValue = Math.max(...validNumbers);
            } else if (selectedCalculationType === "Min") {
                computedValue = Math.min(...validNumbers);
            }

            dates.push(dateStr);
            values.push(computedValue);
        });

        setChartData({ dates, values });
    }, [rawDaysData, selectedDataType, selectedCalculationType]);

    // Initial fetch and custom event listener for immediate updates
    useEffect(() => {
        fetchRecentRecords();

        const handleLiveUpdate = () => {
            fetchRecentRecords();
        };

        window.addEventListener('oximeter_data_updated', handleLiveUpdate);

        return () => {
            window.removeEventListener('oximeter_data_updated', handleLiveUpdate);
        };
    }, [fetchRecentRecords]);

    // Calculate dynamic gap ratio to keep bar thickness completely constant regardless of day count
    const barCount = chartData.dates.length;
    const dynamicCategoryGapRatio = Math.max(0.2, 1 - (barCount / 7) * 0.7);


    // Closes popup when clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                isFilterPopupOpen &&
                popupRef.current &&
                !popupRef.current.contains(event.target) &&
                filterButtonRef.current &&
                !filterButtonRef.current.contains(event.target)
            ) {
                setIsFilterPopupOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isFilterPopupOpen]);


    return (
        <div className={styles.recentDataApp}>
            <div className={styles.recentDataTitle}>
                <p>Latest Measurements</p>
                <IoFilter
                    className={styles.filterButton}
                    ref={filterButtonRef}
                    onClick={() => setIsFilterPopupOpen((prev) => !prev)}
                />
                {isFilterPopupOpen && (
                    <div className={styles.filterPopup} ref={popupRef}>
                        <p className={styles.popupTitle}>Filter Data</p>
                        <div className={styles.dataTypeRow}>
                            <button
                                className={selectedDataType === "BPM" ? styles.buttonActive : ""}
                                onClick={() => setSelectedDataType("BPM")}
                            >
                                BPM
                            </button>
                            <button
                                className={selectedDataType === "SpO2" ? styles.buttonActive : ""}
                                onClick={() => setSelectedDataType("SpO2")}
                            >
                                SpO2
                            </button>
                        </div>
                        <div className={styles.calculationTypeRow}>
                            <button
                                className={selectedCalculationType === "Avg" ? styles.buttonActive : ""}
                                onClick={() => setSelectedCalculationType("Avg")}
                            >
                                Avg
                            </button>
                            <button
                                className={selectedCalculationType === "Max" ? styles.buttonActive : ""}
                                onClick={() => setSelectedCalculationType("Max")}
                            >
                                Max
                            </button>
                            <button
                                className={selectedCalculationType === "Min" ? styles.buttonActive : ""}
                                onClick={() => setSelectedCalculationType("Min")}
                            >
                                Min
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className={styles.chartContainer}>
                {!loading && chartData.dates.length > 0 ? (
                    <BarChart
                        xAxis={[
                            {
                                id: 'barCategories',
                                data: chartData.dates,
                                scaleType: "band",
                                categoryGapRatio: dynamicCategoryGapRatio, // Keeps bar width slim & fixed
                            },
                        ]}
                        yAxis={[
                            {
                                colorMap: (selectedDataType === "SpO2" && selectedCalculationType === "Avg") ? {
                                    type: 'piecewise',
                                    thresholds: [95],
                                    colors: ['#c1d338', '#ff3b30'], // alerts user for spo2 levels lower than 95
                                } : undefined,
                            },
                        ]}
                        series={[
                            {
                                data: chartData.values,
                                color: '#ff3b30', // Vibrant bar color
                                label: `${selectedDataType} - ${selectedCalculationType}`, // Enables "BPM" or "SpO2" inside hover tooltip
                            },
                        ]}
                        margin={{ top: 15, bottom: 0, left: -10, right:10 }}
                        slotProps={{
                            legend: { hidden: true }, // Hide default top legend
                            popper: {
                                sx: {
                                    // Custom tooltip container styling
                                    '& .MuiChartsTooltip-paper': {
                                        backgroundColor: '#5f5f5f !important',
                                        color: '#f3f4f6 !important',
                                        borderRadius: '6px',
                                        border: 'none !important',
                                        boxShadow: '0 4px 14px rgba(0,0,0,0.35) !important',
                                        padding: '4px 8px',
                                    },
                                    '& .MuiChartsTooltip-table': {
                                        color: '#f3f4f6 !important',
                                    },
                                    '& .MuiChartsTooltip-cell': {
                                        color: '#f3f4f6 !important',
                                        border: 'none !important',
                                    },
                                    '& .MuiChartsTooltip-row': {
                                        color: '#f3f4f6 !important',
                                    },
                                    '& .MuiTypography-root': {
                                        color: '#f3f4f6 !important',
                                    },
                                },
                            },
                        }}
                        sx={{
                            // Axis lines styling
                            '& .MuiChartsAxis-line': {
                                stroke: '#f3f4f6 !important',
                                strokeWidth: 1,
                            },
                            // Tick marks styling
                            '& .MuiChartsAxis-tick': {
                                stroke: '#f3f4f6 !important',
                            },
                            // Axis label and numbers styling
                            '& .MuiChartsAxis-tickLabel': {
                                fill: '#a9abad !important',
                                fontSize: 12,
                                fontWeight: 300,
                            },
                            // Rounded bar corners
                            '& .MuiBarElement-root': {
                                rx: 4,
                            },
                        }}
                    />
                ) : !loading ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                        <p style={{ color: '#9ca3af', fontSize: '0.85rem', fontWeight: 300 }}>
                            No measurement history available.
                        </p>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default RecentDataApp;