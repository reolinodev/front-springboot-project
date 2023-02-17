package com.front.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequiredArgsConstructor
@RequestMapping("/")
public class MenuController {

    /**
     * 메뉴정보
     */
    @GetMapping(value = "/page/menu/menu")
    public ModelAndView menuView() {
        ModelAndView mav = new ModelAndView();
        mav.setViewName("content/menu/menu");
        return mav;
    }

    /**
     * 메뉴별권한정보
     */
    @GetMapping(value = "/page/menu/menuAuth")
    public ModelAndView authMenuView() {
        ModelAndView mav = new ModelAndView();
        mav.setViewName("content/menu/menuAuth");
        return mav;
    }


}
