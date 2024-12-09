import './CircularProgress.scss';

const CircularProgress = ({ percentage }) => {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="progress-wrapper">
            <svg className="progress-ring" width="120" height="120">
                <circle
                    className="progress-ring__circle"
                    stroke="blue"
                    strokeWidth="8"
                    fill="transparent"
                    r={radius}
                    cx="60"
                    cy="60"
                    style={{ strokeDashoffset }}
                    strokeDasharray={circumference}
                />
            </svg>
            <span className="progress-text">{percentage}%</span>
        </div>
    );
};

export default CircularProgress;
