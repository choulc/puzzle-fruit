// import { useMemo } from 'react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateFlagMatrix, updateGameMatrix, updateJudgement, updateLevel, updateTotalCol, updateTotalRow } from '../reducers/gameSlice';
import { stageData } from "../config"

const useBoardGame = () => {

    const gameMatrix = useSelector(state => state.game.gameMatrix)
    const flagMatrix = useSelector(state => state.game.flagMatrix)
    const judgement = useSelector(state => state.game.judgement)
    const totalCol = useSelector(state => state.game.totalCol)
    const totalRow = useSelector(state => state.game.totalRow)
    const currentLevel = useSelector(state => state.game.level)
    const dispatch = useDispatch()

    const [imgIndexArray, setImgIndexArray] = useState([])
    const [pairsRemain, setPairsRemain] = useState(12)
    const [maxLevel] = useState(stageData[stageData.length - 1].level)

    useEffect(() => {
        let currentStageData = stageData?.filter(stage => stage.level === currentLevel)[0]

        if (!!currentStageData) {

            dispatch(updateTotalCol(currentStageData.colSet + 2))
            dispatch(updateTotalRow(currentStageData.rowSet + 2))
            setPairsRemain(currentStageData.colSet * currentStageData.rowSet / 2)

            let temp = []

            //create random list for game
            for (let i = 0; i < currentStageData.colSet * currentStageData.rowSet / 2; i++) {
                let n = i + 1;
                if (n % currentStageData.imgSet) {
                    temp.push(n % currentStageData.imgSet, n % currentStageData.imgSet);
                } else
                    temp.push(currentStageData.imgSet, currentStageData.imgSet);
            }
            for (let i = temp.length - 1; i > 0; i--) {
                let j = Math.floor(Math.random() * (i + 1));
                [temp[i], temp[j]] = [temp[j], temp[i]];
            }
            setImgIndexArray(temp)
        }
    }, [currentLevel, dispatch])

    //init
    useEffect(() => {

        if (imgIndexArray.length > 0) {
            let tempGameMatrix = []
            let tempIndexArray = [...imgIndexArray]
            let tempFlagMatrix = []

            for (let j = 0; j < totalRow; j++) {
                tempGameMatrix.push([])
                tempFlagMatrix.push([])
            }
            for (let i = 0; i < totalCol; i++) {
                for (let j = 0; j < totalRow; j++) {
                    if (i === 0 || i === (totalCol - 1) || j === 0 || j === (totalRow - 1)) {
                        tempGameMatrix[j].push(0)
                    } else {
                        tempGameMatrix[j].push(tempIndexArray.pop())
                    }
                    tempFlagMatrix[j].push(0)
                }
            }
            dispatch(updateGameMatrix(tempGameMatrix))
            dispatch(updateFlagMatrix(tempFlagMatrix))
        }

    }, [imgIndexArray, totalCol, totalRow, dispatch])

    useEffect(() => {

        const clearBoard = () => {

            let tempFlagMatrix = [...flagMatrix]
                .flat()
                .reduce((rows, key, index) => (index % totalCol === 0 ? rows.push([key])
                    : rows[rows.length - 1].push(key)) && rows, []);
            let tempGameMatrix = [...gameMatrix]
                .flat()
                .reduce((rows, key, index) => (index % totalCol === 0 ? rows.push([key])
                    : rows[rows.length - 1].push(key)) && rows, []);

            for (let i = 0; i < totalCol; i++) {
                for (let j = 0; j < totalRow; j++) {
                    if (tempFlagMatrix[j][i] === 1) {
                        tempGameMatrix[j][i] = 0
                    }
                    tempFlagMatrix[j][i] = 0
                }
            }
            dispatch(updateGameMatrix(tempGameMatrix))
            dispatch(updateFlagMatrix(tempFlagMatrix))
        }

        if (judgement) {
            setTimeout(() => {
                clearBoard()
                dispatch(updateJudgement(false))
                setPairsRemain(pairsRemain - 1)
            }, 250);
        }

    }, [judgement, dispatch, flagMatrix, gameMatrix, totalCol, totalRow, pairsRemain])


    const checkLine = (startX, startY, endX, endY) => {
        if (startX !== endX && startY !== endY) {
            return false
        }
        if ((startX === endX && (startY === (endY + 1) || startY === (endY - 1))) || (startY === endY && (startX === (endX + 1) || startX === (endX - 1)))) {
        } else if (startY === endY && (startX + 1) < endX) {
            for (let i = startX + 1; i < endX; i++) { //right
                if (gameMatrix[startY][i] !== 0) return false
            }
        } else if (startY === endY && startX > (endX + 1)) {
            for (let i = startX - 1; i > endX; i--) { //left
                if (gameMatrix[startY][i] !== 0) return false
            }
        } else if (startX === endX && (startY + 1) < endY) {
            for (let i = startY + 1; i < endY; i++) { //down
                if (gameMatrix[i][startX] !== 0) return false
            }
        } else if (startX === endX && startY > (endY + 1)) {
            for (let i = startY - 1; i > endY; i--) { //up
                if (gameMatrix[i][startX] !== 0) return false
            }
        }
        return true
    }

    const drawLine = (startX, startY, endX, endY, flag) => {
        // if (flag !== undefined) {

        flag[startY][startX] = 1
        let noImage = true;

        if ((startX === endX && (startY === (endY + 1) || startY === (endY - 1))) || (startY === endY && (startX === (endX + 1) || startX === (endX - 1)))) {
            flag[endY][endX] = 1
        } else if (startY === endY && (startX + 1) < endX) {
            for (let i = startX + 1; i < endX; i++) { //right
                (gameMatrix[startY][i] !== 0) && (noImage = false);
            }
            if (noImage) {
                for (let i = startX + 1; i <= endX; i++) {
                    flag[startY][i] = 1
                }
            }
        } else if (startY === endY && startX > (endX + 1)) {
            for (let i = startX - 1; i > endX; i--) { //left
                (gameMatrix[startY][i] !== 0) && (noImage = false)
            }
            if (noImage) {
                for (let i = startX - 1; i >= endX; i--) {
                    flag[startY][i] = 1
                }
            }
        } else if (startX === endX && (startY + 1) < endY) {
            for (let i = startY + 1; i < endY; i++) { //down
                (gameMatrix[i][startX] !== 0) && (noImage = false)
            }
            if (noImage) {
                for (let i = startY + 1; i <= endY; i++) {
                    flag[i][startX] = 1
                }
            }
        } else if (startX === endX && startY > (endY + 1)) {
            for (let i = startY - 1; i > endY; i--) { //up
                (gameMatrix[i][startX] !== 0) && (noImage = false)
            }
            if (noImage) {
                for (let i = startY - 1; i >= endY; i--) {
                    flag[i][startX] = 1
                }
            }
        }
        // }
    }

    const resetFlagMatrix = (x = null, y = null) => {
        let tempFlagMatrix = [...flagMatrix]
            .flat()
            .reduce((rows, key, index) => (index % totalCol === 0 ? rows.push([key])
                : rows[rows.length - 1].push(key)) && rows, []);

        if (tempFlagMatrix.length > 0) {

            for (let i = 0; i < totalCol; i++) {
                for (let j = 0; j < totalRow; j++) {
                    (x === i && y === j) ? tempFlagMatrix[j][i] = 1 : tempFlagMatrix[j][i] = 0
                }
            }
            dispatch(updateFlagMatrix(tempFlagMatrix))
        }

    }


    const matchCheck = (startX, startY, endX, endY) => {

        let tempFlagMatrix = [...flagMatrix]
            .flat()
            .reduce((rows, key, index) => (index % totalCol === 0 ? rows.push([key])
                : rows[rows.length - 1].push(key)) && rows, []);

        if (checkLine(startX, startY, endX, endY)) {
            drawLine(startX, startY, endX, endY, tempFlagMatrix)
            dispatch(updateFlagMatrix(tempFlagMatrix))
            dispatch(updateJudgement(true))
        } else if (checkLine(startX, startY, endX, startY) && checkLine(endX, startY, endX, endY) && gameMatrix[startY][endX] === 0) {
            resetFlagMatrix()
            drawLine(startX, startY, endX, startY, tempFlagMatrix)
            drawLine(endX, startY, endX, endY, tempFlagMatrix)
            dispatch(updateFlagMatrix(tempFlagMatrix))
            dispatch(updateJudgement(true))
        } else if (checkLine(startX, startY, startX, endY) && checkLine(startX, endY, endX, endY) && gameMatrix[endY][startX] === 0) {
            resetFlagMatrix()
            drawLine(startX, startY, startX, endY, tempFlagMatrix)
            drawLine(startX, endY, endX, endY, tempFlagMatrix)
            dispatch(updateFlagMatrix(tempFlagMatrix))
            dispatch(updateJudgement(true))
        }
        else {
            resetFlagMatrix()

            for (let i = 1; i < Math.abs(startX - endX); i++) {
                if (startX < endX && checkLine(startX, startY, startX + i, startY) && checkLine(startX + i, startY, startX + i, endY) && checkLine(startX + i, endY, endX, endY) && gameMatrix[startY][startX + i] === 0 && gameMatrix[endY][startX + i] === 0) { //z形狀之一
                    resetFlagMatrix()
                    drawLine(startX, startY, startX + i, startY, tempFlagMatrix)
                    drawLine(startX + i, startY, startX + i, endY, tempFlagMatrix)
                    drawLine(startX + i, endY, endX, endY, tempFlagMatrix)
                    dispatch(updateFlagMatrix(tempFlagMatrix))
                    dispatch(updateJudgement(true))
                    return

                } else if (startX > endX && checkLine(startX, startY, startX - i, startY) && checkLine(startX - i, startY, startX - i, endY) && checkLine(startX - i, endY, endX, endY) && gameMatrix[startY][startX - i] === 0 && gameMatrix[endY][startX - i] === 0) { //z形狀之二
                    resetFlagMatrix()
                    drawLine(startX, startY, startX - i, startY, tempFlagMatrix);
                    drawLine(startX - i, startY, startX - i, endY, tempFlagMatrix);
                    drawLine(startX - i, endY, endX, endY, tempFlagMatrix);
                    dispatch(updateFlagMatrix(tempFlagMatrix))
                    dispatch(updateJudgement(true))
                    return
                }
            }
            for (let i = 1; i < Math.abs(startY - endY); i++) {
                if (startY < endY && checkLine(startX, startY, startX, startY + i) && checkLine(startX, startY + i, endX, startY + i) && checkLine(endX, startY + i, endX, endY) && gameMatrix[startY + i][startX] === 0 && gameMatrix[startY + i][endX] === 0) { //n形狀之一
                    resetFlagMatrix()
                    drawLine(startX, startY, startX, startY + i, tempFlagMatrix);
                    drawLine(startX, startY + i, endX, startY + i, tempFlagMatrix);
                    drawLine(endX, startY + i, endX, endY, tempFlagMatrix);
                    dispatch(updateFlagMatrix(tempFlagMatrix))
                    dispatch(updateJudgement(true))
                    return
                } else if (startY > endY && checkLine(startX, startY, startX, startY - i) && checkLine(startX, startY - i, endX, startY - i) && checkLine(endX, startY - i, endX, endY) && gameMatrix[startY - i][startX] === 0 && gameMatrix[startY - i][endX] === 0) { //n形狀之二
                    resetFlagMatrix()
                    drawLine(startX, startY, startX, startY - i, tempFlagMatrix);
                    drawLine(startX, startY - i, endX, startY - i, tempFlagMatrix);
                    drawLine(endX, startY - i, endX, endY, tempFlagMatrix);
                    dispatch(updateFlagMatrix(tempFlagMatrix))
                    dispatch(updateJudgement(true))
                    return
                }
            }
            for (let i = (startY > endY ? startY : endY) + 1; i < totalRow; i++) {
                if (checkLine(startX, startY, startX, i) && checkLine(startX, i, endX, i) && checkLine(endX, i, endX, endY) && gameMatrix[i][startX] === 0 && gameMatrix[i][endX] === 0) { // ㄇ形狀之一U
                    resetFlagMatrix()
                    drawLine(startX, startY, startX, i, tempFlagMatrix);
                    drawLine(startX, i, endX, i, tempFlagMatrix);
                    drawLine(endX, i, endX, endY, tempFlagMatrix);
                    dispatch(updateFlagMatrix(tempFlagMatrix))
                    dispatch(updateJudgement(true))
                    return
                }
            }
            for (let i = (startY < endY ? startY : endY) - 1; i >= 0; i--) {
                if (checkLine(startX, startY, startX, i) && checkLine(startX, i, endX, i) && checkLine(endX, i, endX, endY) && gameMatrix[i][startX] === 0 && gameMatrix[i][endX] === 0) { // ㄇ形狀之二
                    resetFlagMatrix()
                    drawLine(startX, startY, startX, i, tempFlagMatrix);
                    drawLine(startX, i, endX, i, tempFlagMatrix);
                    drawLine(endX, i, endX, endY, tempFlagMatrix);
                    dispatch(updateFlagMatrix(tempFlagMatrix))
                    dispatch(updateJudgement(true))
                    return
                }
            }
            for (let i = (startX > endX ? startX : endX) + 1; i < totalCol; i++) {
                if (checkLine(startX, startY, i, startY) && checkLine(i, startY, i, endY) && checkLine(i, endY, endX, endY) && gameMatrix[startY][i] === 0 && gameMatrix[endY][i] === 0) { // Ｃ形狀之一
                    resetFlagMatrix()
                    drawLine(startX, startY, i, startY, tempFlagMatrix);
                    drawLine(i, startY, i, endY, tempFlagMatrix);
                    drawLine(i, endY, endX, endY, tempFlagMatrix);
                    dispatch(updateFlagMatrix(tempFlagMatrix))
                    dispatch(updateJudgement(true))
                    return
                }
            }
            for (let i = (startX < endX ? startX : endX) - 1; i >= 0; i--) {
                if (checkLine(startX, startY, i, startY) && checkLine(i, startY, i, endY) && checkLine(i, endY, endX, endY) && gameMatrix[startY][i] === 0 && gameMatrix[endY][i] === 0) { // Ｃ形狀之二
                    resetFlagMatrix()
                    drawLine(startX, startY, i, startY, tempFlagMatrix);
                    drawLine(i, startY, i, endY, tempFlagMatrix);
                    drawLine(i, endY, endX, endY, tempFlagMatrix);
                    dispatch(updateFlagMatrix(tempFlagMatrix))
                    dispatch(updateJudgement(true))
                    return
                }
            }
        }
    }

    const gameReset = () => {
        let currentStageData = stageData?.filter(stage => stage.level === 1)[0]

        if (!!currentStageData) {

            dispatch(updateLevel(currentStageData.level))
            dispatch(updateTotalCol(currentStageData.colSet + 2))
            dispatch(updateTotalRow(currentStageData.rowSet + 2))
            dispatch(updateJudgement(false))
            setPairsRemain(currentStageData.colSet * currentStageData.rowSet / 2)

            let temp = []

            //create random list for game
            for (let i = 0; i < currentStageData.colSet * currentStageData.rowSet / 2; i++) {
                let n = i + 1;
                if (n % currentStageData.imgSet) {
                    temp.push(n % currentStageData.imgSet, n % currentStageData.imgSet);
                } else
                    temp.push(currentStageData.imgSet, currentStageData.imgSet);
            }
            for (let i = temp.length - 1; i > 0; i--) {
                let j = Math.floor(Math.random() * (i + 1));
                [temp[i], temp[j]] = [temp[j], temp[i]];
            }
            setImgIndexArray(temp)
        }
    }

    return { matchCheck, resetFlagMatrix, gameReset, pairsRemain, maxLevel, judgement }

}

export default useBoardGame;