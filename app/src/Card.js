import TwoClubs from './cards/2C.svg'
import ThreeClubs from './cards/3C.svg'
import FourClubs from './cards/4C.svg'
import FiveClubs from './cards/5C.svg'
import SixClubs from './cards/6C.svg'
import SevenClubs from './cards/7C.svg'
import EightClubs from './cards/8C.svg'
import NineClubs from './cards/9C.svg'
import TenClubs from './cards/TC.svg'
import JackClubs from './cards/JC.svg'
import QueenClubs from './cards/QC.svg'
import KingClubs from './cards/KC.svg'
import AceClubs from './cards/KC.svg'
import TwoSpades from './cards/2S.svg'
import ThreeSpades from './cards/3S.svg'
import FourSpades from './cards/4S.svg'
import FiveSpades from './cards/5S.svg'
import SixSpades from './cards/6S.svg'
import SevenSpades from './cards/7S.svg'
import EightSpades from './cards/8S.svg'
import NineSpades from './cards/9S.svg'
import TenSpades from './cards/TS.svg'
import JackSpades from './cards/JS.svg'
import QueenSpades from './cards/QS.svg'
import KingSpades from './cards/KS.svg'
import AceSpades from './cards/KS.svg'
import TwoDiamonds from './cards/2D.svg'
import ThreeDiamonds from './cards/3D.svg'
import FourDiamonds from './cards/4D.svg'
import FiveDiamonds from './cards/5D.svg'
import SixDiamonds from './cards/6D.svg'
import SevenDiamonds from './cards/7D.svg'
import EightDiamonds from './cards/8D.svg'
import NineDiamonds from './cards/9D.svg'
import TenDiamonds from './cards/TD.svg'
import JackDiamonds from './cards/JD.svg'
import QueenDiamonds from './cards/QD.svg'
import KingDiamonds from './cards/KD.svg'
import AceDiamonds from './cards/KD.svg'
import TwoHearts from './cards/2H.svg'
import ThreeHearts from './cards/3H.svg'
import FourHearts from './cards/4H.svg'
import FiveHearts from './cards/5H.svg'
import SixHearts from './cards/6H.svg'
import SevenHearts from './cards/7H.svg'
import EightHearts from './cards/8H.svg'
import NineHearts from './cards/9H.svg'
import TenHearts from './cards/TH.svg'
import JackHearts from './cards/JH.svg'
import QueenHearts from './cards/QH.svg'
import KingHearts from './cards/KH.svg'
import AceHearts from './cards/KH.svg'



export function Card({card, height}){

    var cards = {
        '2C':   TwoClubs,
        '3C':   ThreeClubs,
        '4C':   FourClubs,
        '5C':   FiveClubs,
        '6C':   SixClubs,
        '7C':   SevenClubs,
        '8C':   EightClubs,
        '9C':   NineClubs,
        '10C':  TenClubs,
        '11C':  JackClubs,
        '12C':  QueenClubs,
        '13C':  KingClubs,
        '14C':  AceClubs,
        '2S':   TwoSpades,
        '3S':   ThreeSpades,
        '4S':   FourSpades,
        '5S':   FiveSpades,
        '6S':   SixSpades,
        '7S':   SevenSpades,
        '8S':   EightSpades,
        '9S':   NineSpades,
        '10S':  TenSpades,
        '11S':  JackSpades,
        '12S':  QueenSpades,
        '13S':  KingSpades,
        '14S':  AceSpades,
        '2D':   TwoDiamonds,
        '3D':   ThreeDiamonds,
        '4D':   FourDiamonds,
        '5D':   FiveDiamonds,
        '6D':   SixDiamonds,
        '7D':   SevenDiamonds,
        '8D':   EightDiamonds,
        '9D':   NineDiamonds,
        '10D':  TenDiamonds,
        '11D':  JackDiamonds,
        '12D':  QueenDiamonds,
        '13D':  KingDiamonds,
        '14D':  AceDiamonds,
        '2H':   TwoHearts,
        '3H':   ThreeHearts,
        '4H':   FourHearts,
        '5H':   FiveHearts,
        '6H':   SixHearts,
        '7H':   SevenHearts,
        '8H':   EightHearts,
        '9H':   NineHearts,
        '10H':  TenHearts,
        '11H':  JackHearts,
        '12H':  QueenHearts,
        '13H':  KingHearts,
        '14H':  AceHearts,       
    }


    var key = card.Value + card.Suit[0]
    
    return <img src={cards[key]} width="120" height="100%" />
    
}

