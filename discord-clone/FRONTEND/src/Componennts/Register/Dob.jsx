import './css/Dob.css'

export default function Dob({ dob, setDob }) {
    return (
        <div>
            <label>DATE OF BIRTH</label><span style={{ color: "#F04747" }}>*</span><br />
            <div className='selectContainer'>
                <select className='eachSelect' value={dob.month} onChange={(e) => setDob({ ...dob, month: e.target.value })} required>
                    <option value="">Month</option>
                    <option value="1">January</option>
                    <option value="2">February</option>
                    <option value="3">March</option>
                    <option value="4">April</option>
                    <option value="5">May</option>
                    <option value="6">June</option>
                    <option value="7">July</option>
                    <option value="8">August</option>
                    <option value="9">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                </select>
                <select className='eachSelect' value={dob.day} onChange={(e) => setDob({ ...dob, day: e.target.value })} required>
                    <option value="">Day</option>
                    {[...Array(31).keys()].map(d => (
                        <option key={d+1} value={d+1}>{d+1}</option>
                    ))}
                </select>
                <select className='eachSelect' value={dob.year} onChange={(e) => setDob({ ...dob, year: e.target.value })} required>
                    <option value="">Year</option>
                    {[...Array(100)].map((_, i) => {
                        const year = 2025 - i;
                        return <option key={year} value={year}>{year}</option>;
                    })}
                </select>
            </div>
        </div>
    );
}
