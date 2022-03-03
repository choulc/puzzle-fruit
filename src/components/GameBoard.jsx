import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled'
import { Container, Grid, IconButton, Button, Box, Modal } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux';
import useMatchCheck from '../hooks/useBoardGame';
import { updateLevel } from '../reducers/gameSlice';
// import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';
import useCountDown from '../hooks/useCountDown';
import { stageData } from '../config';
import successImg from '../assets/img/success.svg'
import gameOverImg from '../assets/img/gameOver.svg'
import VictoryImg from '../assets/img/victory.svg'
import { Link } from "react-router-dom";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'min(400px, 70vw)',
    height: 'min( 300px, 80vh)',
    bgcolor: '#feb83b',
    border: '2px solid #000',
    borderRadius: '20px',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
};

const GameBoard = () => {

    const gameMatrix = useSelector(state => state.game.gameMatrix)
    const flagMatrix = useSelector(state => state.game.flagMatrix)
    const currentLevel = useSelector(state => state.game.level)
    const dispatch = useDispatch()

    const [firstSelected, setFirstSelected] = useState(null)

    const { matchCheck, resetFlagMatrix, gameReset, pairsRemain, maxLevel } = useMatchCheck()
    const { timeLeft, isTimeOut, pauseCountDown, startCountDown, setTimeLeft, resumeCountDown } = useCountDown({ initTime: 10 })

    const [open, setOpen] = useState(false);

    useEffect(() => {

        let currentStageTime = stageData.filter(stage => stage.level === currentLevel)[0].time

        setTimeLeft(currentStageTime)
        startCountDown()

    }, [setTimeLeft, startCountDown, currentLevel])

    useEffect(() => {

        pairsRemain === 0 && pauseCountDown()

    }, [pairsRemain, pauseCountDown])

    const handleImgSelected = (row, col) => {

        if (!isTimeOut) {
            if (firstSelected === null) {
                setFirstSelected([col, row])
            } else if (col === firstSelected[0] && row === firstSelected[1]) {
                setFirstSelected(null)
            } else if (col !== firstSelected[0] || row !== firstSelected[1]) {
                if (gameMatrix[row][col] === gameMatrix[firstSelected[1]][firstSelected[0]]) {

                    resetFlagMatrix(firstSelected[0], firstSelected[1])
                    matchCheck(firstSelected[0], firstSelected[1], col, row)
                }
                setFirstSelected(null)
            }
        }
    }

    const handleOpen = () => {
        setOpen(true);
        pauseCountDown();
    };
    const handleClose = () => {
        setOpen(false);
        (pairsRemain !== 0) && resumeCountDown();
    };


    return (
        <StyledContainer maxWidth='lg'>
            <StyledGrid
                container
                direction={{ xs: "column", sm: 'row' }}
                justifyContent="center"
                alignItems="center"
            >
                <GameInfoContainer item
                    xs={12}
                    sm={2}
                    md={12}
                    order={{ xs: 1, sm: 2, md: 1 }}
                >
                    <GameInfo container>
                        <LevelInfo item
                            xs={3}
                            sm={12}
                            md={3}
                            order={{ sm: 3, md: 1 }}
                        >
                            <div>{`Lv. ${currentLevel}`}</div>
                        </LevelInfo>
                        <TimerContainer item
                            xs={6}
                            sm={12}
                            md={6}
                            order={{ sm: 2 }}
                            lastfewsec={timeLeft <= 10 ? 'true' : 'false'}
                        >
                            <div>
                                {timeLeft}
                            </div>
                        </TimerContainer>
                        <MenuContainer item
                            xs={3}
                            sm={12}
                            md={3}
                            order={{ sm: 1, md: 3 }}
                        >
                            <div>
                                <IconButton
                                    color="primary"
                                    aria-label="setting"
                                    component="span"
                                    onClick={handleOpen}>
                                    <SettingsIcon sx={{ color: '#111' }} />
                                </IconButton>
                            </div>
                        </MenuContainer>
                        <GridEmpty item
                            sx={{ display: { xs: 'none', sm: 'block', md: 'none' } }}
                            sm={12}
                            order={{ sm: 4 }}
                        >
                        </GridEmpty>
                    </GameInfo>
                </GameInfoContainer>
                <Grid item xs={12}
                    order={{ xs: 3 }}
                    sx={{ display: { xs: 'block', sm: 'block', md: 'block' }, marginTop: '4px', maxHeight: '30px' }}

                >
                    <a href="https://www.vecteezy.com/free-vector/fruit-icon">Fruit Icon Vectors by Vecteezy</a>
                </Grid>
                <Grid item xs={12} sm={10} md={12} order={{ xs: 2, sm: 1, md: 2 }} alignSelf={{ md: 'flex-start' }}>
                    <GameBoardContainer>
                        <GameBoardDiv>
                            {gameMatrix.map((row, rowIndex) => (
                                <GameRow key={rowIndex}>
                                    {row.map((cell, colIndex) => (
                                        <GameCell
                                            key={colIndex}
                                            className={firstSelected !== null && colIndex === firstSelected[0] && rowIndex === firstSelected[1] ? 'selected' : flagMatrix[rowIndex][colIndex] === 1 ? 'selected' : ''}
                                            onTouchEnd={(e) => { gameMatrix[rowIndex][colIndex] !== 0 && handleImgSelected(rowIndex, colIndex); e.preventDefault() }}
                                            onClick={() => { gameMatrix[rowIndex][colIndex] !== 0 && handleImgSelected(rowIndex, colIndex) }}
                                        >
                                            {cell !== 0 && <img
                                                src={require(`../assets/img/${cell}.svg`)}
                                                alt={cell}
                                                onTouchEnd={(e) => { handleImgSelected(rowIndex, colIndex); e.preventDefault() }}
                                                onClick={() => { gameMatrix[rowIndex][colIndex] !== 0 && handleImgSelected(rowIndex, colIndex) }}
                                            />}
                                        </GameCell>
                                    ))}
                                </GameRow>
                            ))}
                        </GameBoardDiv>
                        {(pairsRemain === 0 || isTimeOut) && (
                            <PopOverImgContainer isTimeOut={isTimeOut}>
                                <ImgContainer>
                                    {pairsRemain === 0 && currentLevel < maxLevel && <img src={successImg} alt="success" />}
                                    {pairsRemain === 0 && currentLevel === maxLevel && <img src={VictoryImg} alt="victory" />}
                                    {isTimeOut && <img src={gameOverImg} alt="game over" />}
                                </ImgContainer>
                                <OptionContainer>
                                    {pairsRemain === 0 && currentLevel < maxLevel && <StyledButton disableRipple
                                        variant="text"
                                        onClick={() => { currentLevel < maxLevel && dispatch(updateLevel(currentLevel + 1)) }}
                                    >
                                        Next Level
                                    </StyledButton>}
                                    {(isTimeOut || (pairsRemain === 0 && currentLevel === maxLevel)) && <StyledButton disableRipple
                                        variant="text"
                                        onClick={() => { gameReset(); setTimeLeft(stageData.filter(stage => stage.level === 1)[0].time) }}
                                    >
                                        Play Again
                                    </StyledButton>}
                                </OptionContainer>
                            </PopOverImgContainer>
                        )}
                    </GameBoardContainer>
                </Grid>
            </StyledGrid>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <ModalTitle>SETTING</ModalTitle>
                    <ButtonContainer>
                        <div>
                            <StyledButton disableRipple
                                variant="text"
                                onClick={() => { setOpen(false); resumeCountDown(); }}
                            >
                                Resume
                            </StyledButton>
                        </div>
                        <div>
                            <StyledButton disableRipple
                                variant="text"
                                onClick={() => { gameReset(); setOpen(false); setTimeLeft(stageData.filter(stage => stage.level === 1)[0].time); startCountDown() }}
                            >
                                Restart
                            </StyledButton>
                        </div>
                        <div>
                            <Link
                                to="/"
                                onClick={() => { dispatch(updateLevel(1)) }}
                                style={{ textDecoration: 'none' }}
                            >
                                <StyledButton disableRipple
                                    variant="text"
                                >
                                    Exit
                                </StyledButton>
                            </Link>
                        </div>
                    </ButtonContainer>
                </Box>
            </Modal>
        </StyledContainer >
    );
}

export default GameBoard;

const StyledContainer = styled(Container)`
// background: red;
font-family: 'Comfortaa', cursive;

@media (orientation: portrait) {
    margin-top: calc(50vh - 280px);
    height: calc( 50vh + 280px);
}

`

const StyledGrid = styled(Grid)`

@media (orientation:landscape){
    height:100vh;
}


`

const GameInfoContainer = styled(Grid)`

background: #feb83b;


border-radius: 10px 10px 0 0;

@media (orientation:landscape){
    border-radius: 0 10px 10px 0;
}


@media (min-width: 600px) and (orientation: portrait) {
    border-radius: 0 10px 10px 0;
}

@media (min-width: 900px){
    align-self: end;
    border-radius: 10px 10px 0 0;
}

`

const GameInfo = styled(Grid)`
// display: flex;
width:342px;

@media (orientation:landscape){
    min-height:352px;
    width:100%;

    // flex-direction: column;
}

@media (min-width: 600px) and (orientation: portrait){
    width: 100%;
    min-height:550px;
}

@media (min-width: 900px) and (orientation: portrait){
    width: 100px;
    min-height:550px;
}

@media (min-width: 900px){
    width: 100%;
    min-height:70px;
}


`

const TimerContainer = styled(Grid)`
background:#feb83b;
display: flex;
justify-content: center;
align-items: center;
font-size: 40px;
font-weight: 600;

div {
    color: ${props => props.lastfewsec === 'true' ? 'red' : '#000'};
    display: flex;
    justify-content: center;
    align-items: center;
    border: 6px solid #feb83b;
    border-radius: 30px;
    padding: 20px 18px 16px 18px;
    position: absolute;
    background: #eee;
    height:22px;
    width: 80px;
    z-index: 5;
}

@media (orientation:landscape){
    div{
        border: 3px solid #feb83b;
    }
}


@media (min-width: 600px) and (orientation: portrait) {
    div{
        border: 6px solid #feb83b;
    }
}

@media (min-width: 900px){
    div{
        border: 6px solid #feb83b;
    }
}
`

const LevelInfo = styled(Grid)`
background: #feb83b;
display: flex;
align-items: center;
justify-content: center;
font-size: 20px;
font-weight: 500;
border-radius: 10px 0 0 0;
margin-top:2px;

@media (orientation:landscape){
    border-radius: 0;
    font-size: 28px;
    margin-top: unset;
}


@media (min-width: 600px) and (orientation: portrait) {
    border-radius: 0;
    font-size: 32px;
    margin-top: unset;
}

@media (min-width: 900px){
    border-radius: 10px 0 0 0;
    margin-top: unset;
}
`

const MenuContainer = styled(Grid)`
background: #feb83b;
border-radius: 0 10px 0 0;

div {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-right: 20px;
}

@media (orientation:landscape){
    border-radius: 0 10px 0 0;

    div {
        height: 100%;
        display: flex;
        align-items: flex-start;
        justify-content: flex-end;
        margin-right: 5px;
        padding-left: 20px;
        padding-top: 5px;

        svg{
            height: 30px;
            width: 30px;
        }
    }
}


@media (min-width: 600px) and (orientation: portrait) {
    border-radius: 0 10px 0 0;
    
    div {
        height: 100%;
        display: flex;
        align-items: flex-start;
        justify-content: flex-end;
        padding-top: 10px;
        padding-left: 20px;

        svg{
            height: 30px;
            width: 30px;
        }
    }
}

@media (min-width: 900px){
    border-radius: 0 10px 0 0;

    div {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding-top: unset;
        margin-right: 20px;

        svg{
            height: 30px;
            width: 30px;
        }
    }
}
`

const GameBoardDiv = styled.div`
border: 1px solid #c95922;
border-spacing: 0;
background-color: #f8cf7d;
transition: background 0.2s;
display:flex;
flex-direction:column;


img{
    max-width:calc(100% - 2px);
    max-height:calc(100% - 2px);
    user-drag: none;
    -webkit-user-drag: none;
}

img:hover{
    cursor: pointer;
}


& .selected,& .selected:hover{
    background: #fff;
    z-index:200;
}

@media (orientation:landscape){
    flex-direction:unset;
}

@media (min-width: 900px){
    flex-direction:unset;
}
`

const GameRow = styled.div`
display:flex;

@media (orientation:landscape){
    display:unset;
}

@media (min-width: 900px){
    display:unset;
}
`

const GameCell = styled.div`
border: 1px solid #c95922;
text-align: center;
height:32px;
width:32px;
display: flex;
justify-content: center;
align-items: center;

transition: background 0.2s;

&:hover{
    background: rgba(255,255,255,0.4);
}

@media (min-width: 600px) and (orientation: portrait) {
    height:33px;
    width:33px;
}

@media (min-width: 900px) {
    height:42px;
    width:42px;
}


`

const GameBoardContainer = styled.div`
position: relative;
background:#fbeeba;
min-height:500px;
width:342px;
max-width: 100%;
display:flex;
flex-direction:column;
justify-content: center;
align-items:center;
border-radius: 0 0 10px 10px;

@media (orientation:landscape){
    min-height:352px;
    // width:500px;
    width:100%;
    border-radius: 10px 0 0 10px;
}

@media (min-width: 600px) and (orientation: portrait) {
    width: 100%;
    min-height:550px;
    border-radius: 10px 0 0 10px;
}

@media (min-width: 900px){
    width: 100%;
    min-height:500px;
    border-radius: 0 0 10px 10px;
}

`

const PopOverImgContainer = styled.div`
position: absolute;
height: auto;
width: 100%;
height: 100%;
background: ${props => props.isTimeOut ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.5)'};
display: flex;
flex-direction: column;
justify-content: center;
transition: background 0.2s;
border-radius: 0 0 10px 10px;

`

const ImgContainer = styled.div`
width: min(80%, 500px);
margin: 0 auto;
// margin-top:10%;
`

const OptionContainer = styled.div`
width: 100%;
margin-top: 20px;
text-align: center;
    
`

const StyledButton = styled(Button)`
    font-size: 32px;
    
`

const GridEmpty = styled(Grid)`
background: #feb83b;

@media (orientation:landscape){
    border-radius: 0 0 10px 0;
}


@media (min-width: 600px) and (orientation: portrait) {
    border-radius: 0 0 10px 0;
}

@media (min-width: 900px){
}
`

const ModalTitle = styled.div`
text-align: center;
margin-top:20px;
font-size: 2rem;
font-weight: 700;
`

const ButtonContainer = styled.div`
display: flex;
height: calc(100% - 2rem);
flex-direction: column;
justify-content: center;
align-items: center;

`