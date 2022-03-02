import { createSlice } from "@reduxjs/toolkit";

const gameInit = {
    level: 1,
    isTimeout: false,
    score: 0,
    currentSec: 0,
    gameMatrix: [],
    flagMatrix: [],
    totalCol: 8,
    totalRow: 6,
    judgement: false,
}

export const gameSlice = createSlice({
    name: 'game',
    initialState: gameInit,
    reducers: {
        updateLevel: (state, action) => {
            state.level = action.payload
        },
        updateGameMatrix: (state, action) => {
            state.gameMatrix = action.payload
        },
        updateFlagMatrix: (state, action) => {
            state.flagMatrix = action.payload
        },
        updateTotalCol: (state, action) => {
            state.totalCol = action.payload
        },
        updateTotalRow: (state, action) => {
            state.totalRow = action.payload
        },
        updateJudgement: (state, action) => {
            state.judgement = action.payload
        },
    }
})

export const {
    updateLevel,
    updateGameMatrix,
    updateFlagMatrix,
    updateTotalCol,
    updateTotalRow,
    updateJudgement,
} = gameSlice.actions

export default gameSlice.reducer