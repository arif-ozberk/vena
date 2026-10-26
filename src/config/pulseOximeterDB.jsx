import vena_db from "./supabaseClient";


const saveReadingToSupabase = async (userId, isSavingRef, sensorDataRef, isConnectedRef) => {
    if (!userId || isSavingRef.current) return;

    const currentData = sensorDataRef.current;
    const connected = isConnectedRef.current;

    // Data upload conditions
    const isValidMeasurement =
        connected &&
        currentData.finger &&
        currentData.bpm >= 40 && currentData.bpm <= 180 &&
        currentData.spo2 >= 80 && currentData.spo2 <= 100;

    if (!isValidMeasurement) {
        return; // Returns if conditions not met
    }

    try {
        isSavingRef.current = true;

        // Start and end of the day
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0).toISOString();
        const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).toISOString();

        // Check if user has a data entry for today
        const { data: existingRows, error: fetchError } = await vena_db
            .from('pulse_oximeter')
            .select('measurement_id, measurement_data')
            .eq('user_id', userId)
            .gte('created_at', startOfDay)
            .lte('created_at', endOfDay)
            .order('created_at', { ascending: false })
            .limit(1);

        if (fetchError) throw fetchError;

        // New reading object
        const newReading = {
            bpm: currentData.bpm,
            spo2: currentData.spo2,
            timestamp: now.toISOString()
        };

        if (existingRows && existingRows.length > 0) {
            // If daily data already exist
            const existingRow = existingRows[0];
            const currentReadings = Array.isArray(existingRow.measurement_data?.readings)
                ? existingRow.measurement_data.readings
                : [];

            const updatedPayload = {
                ...existingRow.measurement_data,
                readings: [...currentReadings, newReading]
            };

            const { error: updateError } = await vena_db
                .from('pulse_oximeter')
                .update({ measurement_data: updatedPayload })
                .eq('measurement_id', existingRow.measurement_id);

            if (updateError) throw updateError;
            window.dispatchEvent(new CustomEvent('oximeter_data_updated'));
            // console.log("Supabase: Günlük kayda yeni veri eklendi.", newReading);

        } else {
            // If daily data does not exist (first measurement of the day)
            const initialPayload = {
                readings: [newReading]
            };

            const { error: insertError } = await vena_db
                .from('pulse_oximeter')
                .insert([
                    {
                        user_id: userId,
                        measurement_data: initialPayload
                    }
                ]);

            if (insertError) throw insertError;
            window.dispatchEvent(new CustomEvent('oximeter_data_updated'));
            // console.log("Supabase: Bugünün ilk ölçüm satırı oluşturuldu.", newReading);
        }

    } catch (error) {
        console.error("Supabase veri kaydetme hatası:", error);
        toast.error("Database data save error.", toastifyOptions.darkTopRight);
    } finally {
        isSavingRef.current = false;
    }
};


export default { saveReadingToSupabase }