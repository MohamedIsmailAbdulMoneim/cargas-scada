import { motion } from 'framer-motion';

const ErrorMessage = ({ message, fontSize }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      style={{
        color: 'red',
        marginTop: '10px',
        fontFamily: '"Jost", sans-serif',
        fontSize: `${fontSize ? fontSize : '2rem'}`,
        textAlign: 'center',
      }}
    >
      {message}
    </motion.div>
  );
};

export default ErrorMessage;
