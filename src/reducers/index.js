import { configureStore } from '@reduxjs/toolkit'
import gameReduce from './gameSlice'

export default configureStore({
    reducer: {
        game: gameReduce,
    }
})