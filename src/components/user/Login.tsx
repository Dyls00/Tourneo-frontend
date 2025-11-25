import {
    FormControl,
    FormLabel,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useUser } from "../../user";

export const Login = ({ changeView }) => {

      const { login } = useUser();

    const loginForm = useForm({
        defaultValues: { email: "", password: "" }
    });

    const signupForm = useForm({
        defaultValues: { name: "", email: "", password: "", role: "player", tel:"" }
    });

    const onLogin = async (data:any) => {
    const res = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
 
    const json = await res.json();
    console.log(json?.data.user);

    if(json.success === false){
    alert(json.message);
    }

    if (json?.data.user) {
      login({ id: json.data.user.id, 
        token: json.data.token,
        name: json.data.user.name, 
        role: json.data.user.role, 
        tel: json.data.user.tel, 
        email: json.data.user.email});    
        
        changeView("tournois");
    } 
  };

    const onSignup = async (data:any) => {
    const res = await fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const json = await res.json();
    
    if(json.success === false){
    alert(json.message);
    }

    if (json?.data.user) {
      login({ id: json.data.user.id, 
        name: json.data.user.name, 
        role: json.data.user.role,
        token: json.data.token,
        tel: json.data.user.tel,
        email: json.data.user.email});            
    }

    if (json?.data.user) {
    changeView("tournois");
}
  };

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
                                <form className="flip-card__form" action="POST" onSubmit={loginForm.handleSubmit(onLogin)}>
                                    <input
                                        className="flip-card__input"
                                        placeholder="Email"
                                        type="email"
                                        defaultValue=""
                                        {...loginForm.register("email")} />
                                    <input
                                        className="flip-card__input"
                                        placeholder="Password"
                                        type="password"
                                        {...loginForm.register("password")}
                                    />
                                    <button className="flip-card__btn" type="submit">Let`s go!</button>
                                </form>
                            </div>
                            <div className="flip-card__back">
                                <div className="title">Sign up</div>
                                <form
                                    className="flip-card__form"
                                    action="POST"
                                    onSubmit={signupForm.handleSubmit(onSignup)}
                                >
                                    <input
                                        className="flip-card__input"
                                        placeholder="Name"
                                        type="name"
                                        defaultValue=""
                                        {...signupForm.register("name", { required: true })}  />
                                    <input
                                        className="flip-card__input"
                                        placeholder="Email"
                                        type="email"
                                        defaultValue=""
                                        {...signupForm.register("email", { required: true })} />
                                        <input
                                        className="flip-card__input"
                                        placeholder="Phone number"
                                        type="tel"
                                        defaultValue=""
                                        {...signupForm.register("tel", { required: true })} />
                                    <input
                                        className="flip-card__input"
                                        placeholder="password"
                                        type="password"
                                        defaultValue=""
                                        {...signupForm.register("password", { required: true })} />
                                    <FormControl>
                                        <FormLabel id="demo-radio">Role</FormLabel>
                                        <select
                                            className="flip-card__input"
                                            {...signupForm.register("role")}>
                                            <option value="Organizer">Organisateur</option>
                                            <option value="Player">Joueur</option>
                                        </select>
                                    </FormControl>
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
