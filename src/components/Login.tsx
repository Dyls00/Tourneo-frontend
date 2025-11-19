import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { useForm, type SubmitHandler } from "react-hook-form";

export const Login = () => {
  type Inputs = {
    name: string;
    email: string;
    password: string;
    role: string
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

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
                    <input 
                    className="flip-card__input"
                    placeholder="Email"
                    type="email"
                    defaultValue="" 
                    {...register("email")} />
                  <input
                    className="flip-card__input"
                    name="password"
                    placeholder="Password"
                    type="password"
                  />
                  <button className="flip-card__btn">Let`s go!</button>
                </form>
              </div>
              <div className="flip-card__back">
                <div className="title">Sign up</div>
                <form
                  className="flip-card__form"
                  action="POST"
                  onSubmit={handleSubmit(onSubmit)}
                >
                    <input 
                    className="flip-card__input"
                    placeholder="Name"
                    type="name"
                    defaultValue="" 
                    {...register("name", { required: true })} />
                  <input 
                    className="flip-card__input"
                    placeholder="Email"
                    type="email"
                    defaultValue="" 
                    {...register("email", { required: true })} />
                    <input 
                    className="flip-card__input"
                    placeholder="password"
                    type="password"
                    defaultValue="" 
                    {...register("password", { required: true })} />
                  <FormControl>
                    <FormLabel id="demo-radio">Role</FormLabel>
                    <RadioGroup
                      aria-labelledby="demo-radio-buttons-group-label"
                      defaultValue="Organisateur"
                      name="radio-buttons-group"
                    >
                      <FormControlLabel
                        value="organizer"
                        control={<Radio />}
                        label="Organisateur"
                      />
                      <FormControlLabel
                        value="player"
                        control={<Radio />}
                        label="Joueur"
                      />
                    </RadioGroup>
                  </FormControl>
                  {errors.password && <span>This field is required</span>}
                  {errors.email && <span>This field is required</span>}
                  <button className="flip-card__btn" type="submit">Confirm!</button>
                </form>
              </div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};
