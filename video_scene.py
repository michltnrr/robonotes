from manim import *

import numpy as np

class VisualizePartialDerivatives(Scene):
    def construct(self):
        # Title
        title = Text("Visualizing Partial Derivatives").scale(0.9).to_edge(UP)
        self.play(FadeIn(title), run_time=1.5)
        self.wait(1.5)

        # Step 1: Introduce function of 2 variables
        step1 = Text("Step 1: Consider a function of two variables").scale(0.75).to_edge(DOWN)
        eq1 = MathTex("f(x, y) = x^2 + y^2").scale(1).next_to(step1, UP, buff=0.7)
        self.play(FadeIn(step1), FadeIn(eq1), run_time=1.5)
        self.wait(1.8)

        # Fade out title, old eq, then introduce axes
        self.play(FadeOut(title), FadeOut(step1), FadeOut(eq1), run_time=1.3)
        self.wait(1)

        # Step 2: Show surface plot
        step2 = Text("Step 2: Visualize the surface").scale(0.75).to_edge(UP)
        axes = Axes(
            x_range=[-2, 2, 1],
            y_range=[-2, 2, 1],
        ).scale(1.5).to_edge(LEFT, buff=0.7)
        x_label = axes.get_x_axis_label(MathTex("x"))
        y_label = axes.get_y_axis_label(MathTex("y"))
        surface = Surface(
            lambda u, v: axes.c2p(u, v, u**2 + v**2),
            u_range=[-2, 2],
            v_range=[-2, 2],
            resolution=(8, 8)
        ).set_opacity(0.7)
        surface.move_to(axes.get_center())
        surface.set_style(fill_opacity=0.7, stroke_width=0.5)
        self.play(FadeIn(step2), Create(axes), FadeIn(x_label), FadeIn(y_label), run_time=1.5)
        self.play(FadeIn(surface), run_time=1.8)
        self.wait(2)

        # Step 3: Show a specific point and slices
        self.play(FadeOut(step2), run_time=1)
        step3 = Text("Step 3: Take the point (1, 1)").scale(0.75).to_edge(UP)
        pt = Dot(axes.c2p(1, 1), color=RED)
        pt_label = MathTex("(1, 1)").next_to(pt, RIGHT, buff=0.5)
        self.play(FadeIn(step3), FadeIn(pt), FadeIn(pt_label), run_time=1.3)
        self.wait(1.5)

        # Draw x-slice (y fixed)
        slice_x = axes.plot(lambda x: x**2 + 1, x_range=[-2,2], color=BLUE)
        x_text = Text("Slice at y = 1").scale(0.6).next_to(axes, DOWN, buff=0.5)
        self.play(Create(slice_x), FadeIn(x_text), run_time=1.3)
        self.wait(1.8)

        # Fade out x-slice, show y-slice
        self.play(FadeOut(slice_x), FadeOut(x_text), run_time=1)
        slice_y = axes.plot(lambda y: 1**2 + y**2, x_range=[-2,2], color=GREEN)
        y_text = Text("Slice at x = 1").scale(0.6).next_to(axes, DOWN, buff=0.5)
        self.play(Create(slice_y), FadeIn(y_text), run_time=1.2)
        self.wait(1.8)

        # Step 4: Compute partials visually
        self.play(FadeOut(y_text), run_time=1)
        step4 = Text("Step 4: Compute partial derivatives").scale(0.75).to_edge(UP)
        part_x = MathTex(r"\frac{\partial f}{\partial x}\Big|_{(1,1)} = 2x = 2").scale(0.8)
        part_x.next_to(axes, RIGHT, buff=1)
        part_y = MathTex(r"\frac{\partial f}{\partial y}\Big|_{(1,1)} = 2y = 2").scale(0.8)
        part_y.next_to(part_x, DOWN, buff=0.8)
        self.play(FadeIn(step4), FadeIn(part_x), FadeIn(part_y), run_time=1.4)
        self.wait(2)

        # Step 5: Visualize gradients as vectors
        self.play(FadeOut(slice_y), FadeOut(part_x), FadeOut(part_y), FadeOut(step4), run_time=1.2)
        step5 = Text("Step 5: Visualize gradient with vectors").scale(0.75).to_edge(UP)
        vec_x = Arrow(
            axes.c2p(1,1), 
            axes.c2p(1.7,1), 
            buff=0, 
            color=BLUE
        )
        vec_y = Arrow(
            axes.c2p(1,1), 
            axes.c2p(1,1.7), 
            buff=0, 
            color=GREEN
        )
        grad_label = MathTex(r"\nabla f = (2,2)").next_to(axes, RIGHT, buff=1)
        self.play(FadeIn(step5), GrowArrow(vec_x), GrowArrow(vec_y), run_time=1.5)
        self.wait(1.4)
        self.play(FadeIn(grad_label), run_time=1)
        self.wait(1.6)

        # Show vector field of gradient directions
        self.play(FadeOut(step5), FadeOut(grad_label), FadeOut(pt_label), run_time=1)
        step6 = Text("Partial derivatives show slope along axes").scale(0.75).to_edge(DOWN)
        def grad_f(point):
            x, y = point[:2]
            return np.array([2*x, 2*y, 0])
        field = VectorField(grad_f).move_to(axes.get_center())
        self.play(FadeIn(step6), FadeIn(field), run_time=1.9)
        self.wait(2)

        # End
        outro = Text("This is how we visualize partial derivatives!").scale(0.8).to_edge(DOWN)
        self.play(FadeOut(step6), FadeOut(field), FadeOut(surface), FadeOut(vec_x), FadeOut(vec_y), FadeOut(pt), run_time=1.5)
        self.play(FadeIn(outro), run_time=1.2)
        self.wait(2)