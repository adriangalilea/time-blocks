import React, { useState, useEffect } from 'react'
import { Grid, Box, Flex, GridItem } from '@chakra-ui/react'
import { motion } from "framer-motion"


interface TimeBlockProps {
  isHighlighted: boolean;
  isStart: boolean;
  isEnd: boolean;
}

// Custom hook to get and update the current time
const useCurrentTime = () => {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 5000)

    return () => {
      clearInterval(timer)
    }
  }, [])

  return time
}


// Component to render a single grid item
const TimeBlock: React.FC<TimeBlockProps & { delay: number }> = ({
  isHighlighted,
  isStart,
  isEnd,
  delay,
}) => (
  <motion.div
    initial={{ background: '#1A1B2D' }}
    animate={{ background: isHighlighted ? '#E5F901' : '#1A1B2D' }}
    transition={{ delay, duration: 1 }} // Adjust duration here
    style={{
      height: '100%',
      width: '100%',
      border: '1px solid grey',
      flexGrow: 1,
      borderRadius: isStart ? '80px 0 0 80px' : isEnd ? '0 80px 80px 0' : '0',
    }}
  />
);


interface GridQuarterProps {
  currentTime: Date;
  isHour: boolean;
  quarter: number;
}


const GridQuarter: React.FC<GridQuarterProps> = ({ currentTime, isHour, quarter }) => {
  const items = [];

  for (let i = 0; i < 3; i++) {
    let isHighlighted;
    if (isHour) {
      isHighlighted = (currentTime.getHours() % 12) >= i + quarter * 3;
    } else {
      isHighlighted = Math.floor(currentTime.getMinutes() / 5) >= i + quarter * 3;
    }

    const isStart = quarter === 0 && i === 0;
    const isEnd = quarter === 3 && i === 2;

    items.push(
      <TimeBlock
        key={i}
        isHighlighted={isHighlighted}
        isStart={isStart}
        isEnd={isEnd}
        delay={(quarter * 3 + i) * 0.1} // Adjust delay here
      />
    );
  }

  return (
    <div
      style={{ display: 'flex', flexDirection: 'row', height: '100%', width: '25%', marginRight: quarter < 3 ? '2%' : '0' }}
    >
      {items}
    </div>
  )
}

interface GridColumnProps {
  currentTime: Date;
  isHour?: boolean;
}

const GridColumn: React.FC<GridColumnProps> = ({ currentTime, isHour }) => {
  const quarters = []

  for (let i = 0; i < 4; i++) {
    quarters.push(
      <GridQuarter
        key={i}
        currentTime={currentTime}
        isHour={isHour || false}
        quarter={i}
      />
    )
  }

  return (
    <div
      style={{ display: 'flex', flexDirection: 'row', height: '100%', width: '80vw' }}
    >
      {quarters}
    </div>
  )
}

export const App = () => {
  const currentTime = useCurrentTime()

  return (
    <Flex justifyContent="center" alignItems="center" bg="background" h="100vh" w="100vw" p={48}>
      <Grid
        templateRows="repeat(2, 1fr)"
        gap={44}
        height="100%"
      >
        <GridColumn currentTime={currentTime} isHour />
        <GridColumn currentTime={currentTime} />
      </Grid>
    </Flex>
  )
}



export default App
