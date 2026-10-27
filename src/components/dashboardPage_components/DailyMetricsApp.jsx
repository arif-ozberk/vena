import React, { useState, useEffect, useContext, useCallback } from 'react';

// Styles
import styles from "../../sass/dashboardPage_styles/DailyMetricsApp.module.scss";

// Components
import Loader from '../shared_components/Loader';

// Context & DB
import { AuthContext } from '../../context/AuthContext';
import vena_db from '../../config/supabaseClient';


const DailyMetricsApp = () => {

    const { loggedUserData } = useContext(AuthContext);
    const userId = loggedUserData?.user_settings?.user_id || loggedUserData?.id;

    const [loading, setLoading] = useState(true);
    const [metrics, setMetrics] = useState({
        avgBpm: null,
        maxBpm: null,
        minBpm: null,
        avgSpo2: null,
        maxSpo2: null,
        minSpo2: null,
    });


    const fetchTodayMetrics = useCallback(async () => {
        if (!userId) return;

        try {
            const now = new Date();
            const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0).toISOString();
            const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).toISOString();

            const { data, error } = await vena_db
                .from('pulse_oximeter')
                .select('measurement_data')
                .eq('user_id', userId)
                .gte('created_at', startOfDay)
                .lte('created_at', endOfDay)
                .order('created_at', { ascending: false })
                .limit(1);

            if (error) throw error;

            const readings = data?.[0]?.measurement_data?.readings;

            if (Array.isArray(readings) && readings.length > 0) {
                const validBpms = readings.map(r => r.bpm).filter(b => typeof b === 'number' && b > 0);
                const validSpo2s = readings.map(r => r.spo2).filter(s => typeof s === 'number' && s > 0);

                if (validBpms.length > 0 && validSpo2s.length > 0) {
                    const avgBpm = Math.round(validBpms.reduce((sum, val) => sum + val, 0) / validBpms.length);
                    const maxBpm = Math.max(...validBpms);
                    const minBpm = Math.min(...validBpms);

                    const avgSpo2 = Math.round(validSpo2s.reduce((sum, val) => sum + val, 0) / validSpo2s.length);
                    const maxSpo2 = Math.max(...validSpo2s);
                    const minSpo2 = Math.min(...validSpo2s);

                    setMetrics({
                        avgBpm,
                        maxBpm,
                        minBpm,
                        avgSpo2,
                        maxSpo2,
                        minSpo2,
                    });
                } else {
                    setMetrics({ avgBpm: null, maxBpm: null, minBpm: null, avgSpo2: null, maxSpo2: null, minSpo2: null });
                }
            } else {
                setMetrics({ avgBpm: null, maxBpm: null, minBpm: null, avgSpo2: null, maxSpo2: null, minSpo2: null });
            }
        } catch (err) {
            console.error("Error retrieving daily data.", err);
            toast.error("Error retrieving daily data.", toastifyOptions.darkTopRight);
        } finally {
            setLoading(false);
        }
    }, [userId]);


    useEffect(() => {
        fetchTodayMetrics();

        const handleUpdate = () => {
            fetchTodayMetrics();
        };
        window.addEventListener('oximeter_data_updated', handleUpdate);

        // Backup sync every 10 seconds
        const intervalId = setInterval(fetchTodayMetrics, 10000);

        return () => {
            window.removeEventListener('oximeter_data_updated', handleUpdate);
            clearInterval(intervalId);
        };
    }, [fetchTodayMetrics]);


    // Check if data exists
    const hasData = metrics.avgBpm !== null;


    return (
        <div className={styles.dailyMetricsApp}>
            <p className={styles.dailyMetricTitle}>Todays Metrics</p>

            {!loading && hasData ? (
                <div className={styles.dailyMetricGrid}>
                    <div className={styles.leftColumn}>
                        <div className={styles.dailyMetricGridSection}>
                            <p>Avg BPM:</p>
                            <span>{metrics.avgBpm}</span>
                        </div>
                        <div className={styles.dailyMetricGridSection}>
                            <p>Max BPM:</p>
                            <span>{metrics.maxBpm}</span>
                        </div>
                        <div className={styles.dailyMetricGridSection}>
                            <p>Min BPM:</p>
                            <span>{metrics.minBpm}</span>
                        </div>
                    </div>

                    <div className={styles.rightColumn}>
                        <div className={styles.dailyMetricGridSection}>
                            <p>Avg SpO2:</p>
                            <span>%{metrics.avgSpo2}</span>
                        </div>
                        <div className={styles.dailyMetricGridSection}>
                            <p>Max SpO2:</p>
                            <span>%{metrics.maxSpo2}</span>
                        </div>
                        <div className={styles.dailyMetricGridSection}>
                            <p>Min SpO2:</p>
                            <span>%{metrics.minSpo2}</span>
                        </div>
                    </div>
                </div>
            ) : !loading ? (
                <div className={styles.noDataWrapper}>
                    <p className={styles.noDataText}>No measurements recorded today.</p>
                </div>
                ) : <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}><Loader /></div>}
        </div>
    );
};

export default DailyMetricsApp;