type Calenderprops = {
    bookedDates?: number[];
};

const Calender = ({bookedDates = []}: Calenderprops) => {
    const days = Array.from({length: 30}, (_, i) => i + 1);

    const styles = {
        container: {
            border: '1px solid #ddd',
            borderRadius: '12px',
            padding: '20px',
            width: '300px',
            fontFamily: 'sans-serif'
        },
        grid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '8px'
        },
        day: (isBooked: boolean): React.CSSProperties => ({
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center', // Fixat: camelCase + citattecken
            borderRadius: '50%',
            fontSize: '14px',
            cursor: isBooked ? 'not-allowed' : 'pointer',
            backgroundColor: isBooked ? '#f5f5f5' : 'transparent',
            color: isBooked ? '#ccc' : '#222',
            textDecoration: isBooked ? 'line-through' : 'none',
            border: isBooked ? 'none' : '1px solid #eee'
        })
    };

    return (
        // Fixat: Använder style={styles...} istället för className
        <div style={styles.container}>
            <div style={styles.grid}>
                {days.map((day) => {
                    const isBooked = bookedDates.includes(day);

                    return (
                        <div 
                            key={day} 
                            style={styles.day(isBooked)} // Anropar style-funktionen
                        >
                            {day}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Calender;