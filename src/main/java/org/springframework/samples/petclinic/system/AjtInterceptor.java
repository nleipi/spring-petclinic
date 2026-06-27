package org.springframework.samples.petclinic.system;

import java.util.Objects;

import org.springframework.web.servlet.HandlerInterceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class AjtInterceptor implements HandlerInterceptor {

	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
			throws Exception {
		request.setAttribute("is_ajt", Objects.equals(request.getHeader("x-requested-with"), "ajt"));
		return true;
	}

}
