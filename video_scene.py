from manim import *

class SolidOfRevolutionArea(Scene):
    def construct(self):
        title = Text("Area of a Solid of Revolution").scale(0.9)
        title.to_edge(UP)
        self.play(FadeIn(title), run_time=1.5)
        self.wait(2)

        step1 = Text("Step 1: Sketch the function").scale(0.8)
        step1.to_edge(DOWN)
        self.play(FadeIn(step1), run_time=1.2)
        self.wait(1.5)

        axes = Axes(
            x_range=[0, 4, 1],
            y_range=[0, 5, 1],
            x_length=6,
            y_length=3,
        ).to_edge(LEFT, buff=0.7)

        graph = axes.plot(lambda x: x**2, color=BLUE)
        x_label = axes.get_x_axis_label("x").next_to(axes, DOWN)
        y_label = axes.get_y_axis_label("y").next_to(axes, LEFT)
        self.play(Create(axes), FadeIn(x_label), FadeIn(y_label), run_time=1.7)
        self.wait(1.2)
        self.play(Create(graph), run_time=1.5)
        self.wait(1.5)

        self.play(FadeOut(step1), run_time=1)
        self.wait(0.7)

        step2 = Text("Step 2: Shade the region to be rotated").scale(0.8)
        step2.to_edge(DOWN)
        self.play(FadeIn(step2), run_time=1.2)
        self.wait(1)

        area = axes.get_area(graph, [0, 2], color=GREEN_B, opacity=0.6)
        line_x0 = axes.get_vertical_line(axes.c2p(0,0), color=GRAY)
        line_x2 = axes.get_vertical_line(axes.c2p(2,0), color=GRAY)
        self.play(Create(line_x0), Create(line_x2), run_time=1.0)
        self.play(FadeIn(area), run_time=1.0)
        self.wait(1.7)

        self.play(FadeOut(step2), run_time=1)
        self.wait(0.7)

        step3 = Text("Step 3: Set up the integral for volume").scale(0.8)
        step3.to_edge(DOWN)
        self.play(FadeIn(step3), run_time=1.2)
        self.wait(1)

        integral = MathTex(
            "V", "=",
            r"\pi \int_{0}^{2} \left[",
            "x^2",
            r"\right]^2 dx"
        ).scale(0.95)
        integral.next_to(axes, RIGHT, buff=0.9)
        self.play(Write(integral), run_time=2.0)
        self.wait(2)

        self.play(FadeOut(step3), run_time=1)
        self.wait(0.7)

        step4 = Text("Step 4: Simplify the integrand").scale(0.8)
        step4.to_edge(DOWN)
        self.play(FadeIn(step4), run_time=1.2)
        self.wait(1)

        integral2 = MathTex(
            "V", "=",
            r"\pi \int_{0}^{2}",
            "x^4",
            "dx"
        ).scale(0.95)
        integral2.next_to(axes, RIGHT, buff=0.9)
        self.play(TransformMatchingTex(integral, integral2), run_time=1.8)
        self.wait(1.7)

        self.play(FadeOut(step4), run_time=1)
        self.wait(0.7)

        step5 = Text("Step 5: Calculate the final volume").scale(0.8)
        step5.to_edge(DOWN)
        self.play(FadeIn(step5), run_time=1.2)
        self.wait(1.2)

        answer = MathTex(
            "V", "=",
            r"\pi \left[\dfrac{x^5}{5}\right]_0^2"
            r"=\,\pi \cdot \dfrac{32}{5}"
        ).scale(0.93)
        answer.next_to(axes, RIGHT, buff=0.95)
        self.play(TransformMatchingTex(integral2, answer), run_time=2)
        self.wait(2.2)

        self.play(FadeOut(answer), FadeOut(step5), run_time=1.2)
        self.wait(1)

        finish = Text("The volume is").scale(0.8)
        finish.to_edge(DOWN)
        final_val = MathTex(r"\dfrac{32}{5}\,\pi").set_color(GOLD).scale(1.4)
        final_val.next_to(axes, RIGHT, buff=1)

        self.play(FadeIn(finish), FadeIn(final_val), run_time=1.3)
        self.wait(2.3)

        self.play(FadeOut(final_val), FadeOut(finish), FadeOut(axes), FadeOut(graph), FadeOut(x_label), FadeOut(y_label), FadeOut(line_x0), FadeOut(line_x2), FadeOut(area), FadeOut(title), run_time=2)
        self.wait(1.2)