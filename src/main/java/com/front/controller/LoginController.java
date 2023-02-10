package com.front.controller;

import com.front.domain.Page;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequiredArgsConstructor
@RequestMapping("/")
public class LoginController {

    @GetMapping(value = "")
    public String index() {
        return "forward:/page/login";
    }


    @PostMapping(value = "login")
    public String login() {
        return "redirect:";
    }

    @GetMapping("logout")
    public String logout() {
        return "redirect:";
    }


}
