import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";


export const Login = () => {
  return (
      <div className="log">
        <div className="wrapper">
            <div className="card-switch">
            <label className="switch">
                <input type="checkbox" className="toggle" />
                <span className="slider" />
                <span className="card-side" />
                <div className="flip-card__inner">
                <div className="flip-card__front">
                    <div className="title">Log in</div>
                    <form className="flip-card__form" action="">
                    <input className="flip-card__input" name="email" placeholder="Email" type="email" />
                    <input className="flip-card__input" name="password" placeholder="Password" type="password" />
                    <button className="flip-card__btn">Let`s go!</button>
                    </form>
                </div>
                <div className="flip-card__back">
                    <div className="title">Sign up</div>
                    <form className="flip-card__form" action="POST">
                    <input className="flip-card__input" placeholder="Name" type="name" />
                    <input className="flip-card__input" name="email" placeholder="Email" type="email" />
                    <input className="flip-card__input" name="password" placeholder="Password" type="password" />
                    <FormControl>
                        <FormLabel id="demo-radio">Role</FormLabel>
                            <RadioGroup
                                aria-labelledby="demo-radio-buttons-group-label"
                                defaultValue="Organisateur"
                                name="radio-buttons-group"
                            >
                                <FormControlLabel value="Organisateur" control={<Radio />} label="Organisateur" />
                                <FormControlLabel value="Joueur" control={<Radio />} label="Joueur" />
                            </RadioGroup>
                    </FormControl>
                    <button className="flip-card__btn">Confirm!</button>
                    </form>
                </div>
                </div>
            </label>
            </div>  
        </div> 
      </div>
  );
}
