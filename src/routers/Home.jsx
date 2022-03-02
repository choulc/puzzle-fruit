import React from 'react';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { Container } from '@mui/material';
import titleImg from '../assets/img/apple-title.png';

const Home = () => {
    return (
        <BgContainer>
            <StyledContainer maxWidth="md">

                <TitleImgContainer>
                    <img src={titleImg} alt="title" />
                </TitleImgContainer>
                <OptionContainer>
                    <Link to="game">GAME START</Link>
                </OptionContainer>
            </StyledContainer>
        </BgContainer>
    );
}

export default Home;

const BgContainer = styled.div`
width: 100%;
height: 100vh;
background: #fbeeba;
`

const StyledContainer = styled(Container)`
padding-top: calc(50vh - 175px);
height: 100vh;

@media (min-width: 600px) and (orientation: portrait) {
    padding-top: calc(50vh - 205px);
}

@media (min-width: 900px){
    padding-top: calc(50vh - 235px);
}
    
`

const TitleImgContainer = styled.div`
max-width: 100%;
display: flex;
justify-content: center;

img {
    width:100%;
    height: auto;
}

@media (orientation: landscape) {
    img{
        max-width:50vw;
    }
}

@media (min-width: 600px) and (orientation: portrait) {
    img{
        max-width:60vw;
    } 
}

@media (min-width: 900px){
    img{
        max-width: min(60vw, 550px);
    } 
}
`
const OptionContainer = styled.div`
margin-top: 30px;
display: flex;
justify-content: center;
font-size: 3rem;
transition: all 0.2s;
a{
    color: #111;
    text-decoration: none;
}
a:hover{
    color: green;
}
`