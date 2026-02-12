from manim import *

class GraphIntersectionSteps(Scene):
    def construct(self):
        # Title
        title = Text("How to Find the Intersection of Two Graphs").scale(0.95)
        title.to_edge(UP)
        self.play(Write(title), run_time=2)
        self.wait(2)

        # Step 1: Draw Axes
        step1 = Text("Step 1: Draw both graphs", font_size=38).scale(0.65)
        step1.next_to(title, DOWN, buff=0.7)
        axes = Axes(
            x_range=[-2, 4, 1],
            y_range=[-2, 8, 2],
            x_length=7,
            y_length=4.2,
            axis_config={"color": GREY_B},
        )
        axes.to_edge(DOWN, buff=0.75)
        x_label = axes.get_x_axis_label("x")
        y_label = axes.get_y_axis_label("y")
        self.play(FadeIn(step1), Create(axes), FadeIn(x_label), FadeIn(y_label), run_time=2)
        self.wait(2)

        # Step 2: Plot first function
        step2 = Text("Step 2: Plot y = x^2 + 1", font_size=38).scale(0.65)
        step2.next_to(title, DOWN, buff=0.7)
        graph1 = axes.plot(lambda x: x**2 + 1, x_range=[-1.8, 2.2], color=BLUE_C)
        equation1 = MathTex("y = x^2 + 1").scale(0.95)
        equation1.next_to(axes, RIGHT, buff=0.7)
        self.play(FadeOut(step1), FadeIn(step2), Create(graph1), run_time=2)
        self.wait(1.5)
        self.play(FadeIn(equation1), run_time=1)
        self.wait(1)

        # Step 3: Plot second function
        step3 = Text("Step 3: Plot y = x + 3", font_size=38).scale(0.65)
        step3.next_to(title, DOWN, buff=0.7)
        graph2 = axes.plot(lambda x: x + 3, x_range=[-1.8, 4], color=RED_C)
        equation2 = MathTex("y = x + 3").scale(0.95)
        equation2.next_to(equation1, DOWN, buff=0.6)
        self.play(FadeOut(step2), FadeIn(step3), Create(graph2), run_time=2)
        self.wait(1.5)
        self.play(FadeIn(equation2), run_time=1)
        self.wait(1)

        # Step 4: Highlight intersection
        step4 = Text("Step 4: Locate their intersection", font_size=38).scale(0.65)
        step4.next_to(title, DOWN, buff=0.7)
        # Intersection at x^2 + 1 = x + 3 -> x^2 - x - 2 = 0 -> x=2, x=-1
        # Let's highlight at x=2
        intersect_x = 2
        intersect_y = intersect_x + 3  # 5
        intersection_point = axes.c2p(intersect_x, intersect_y)
        dot = Dot(intersection_point, color=GOLD, radius=0.12)
        intersection_label = MathTex("(2,~5)").scale(0.9)
        intersection_label.next_to(dot, UP + RIGHT, buff=0.4)
        self.play(FadeOut(step3), FadeIn(step4), Indicate(dot, color=GOLD, scale_factor=1.8), run_time=2)
        self.wait(2)
        self.play(FadeIn(dot), FadeIn(intersection_label), run_time=1)
        self.wait(1)

        # Step 5: Solve the equations
        step5 = Text("Step 5: Solve equations to find intersection", font_size=36).scale(0.7)
        step5.next_to(title, DOWN, buff=0.7)
        system = VGroup(
            MathTex("x^2 + 1 = x + 3").scale(0.92),
            MathTex("x^2 - x - 2 = 0").scale(0.92),
            MathTex("x = 2,~ x = -1").scale(0.92)
        ).arrange(DOWN, buff=0.6)
        system.next_to(axes, RIGHT, buff=0.7)
        self.play(FadeOut(step4), FadeIn(step5), FadeOut(equation1), FadeOut(equation2), run_time=1)
        self.wait(1)
        self.play(FadeIn(system[0]), run_time=1.2)
        self.wait(1)
        self.play(FadeIn(system[1]), run_time=1.2)
        self.wait(1)
        self.play(FadeIn(system[2]), run_time=1.2)
        self.wait(2)

        # Fade most things out, end with key idea
        summary = Text("Graphs intersect where\ntheir equations are equal!", font_size=42).scale(0.85)
        summary.to_edge(DOWN, buff=0.9)
        self.play(
            FadeOut(step5),
            FadeOut(title),
            FadeOut(system, shift=UP),
            FadeOut(dot),
            FadeOut(intersection_label),
            FadeOut(graph1),
            FadeOut(graph2),
            FadeOut(x_label),
            FadeOut(y_label),
            FadeOut(axes),
            run_time=2
        )
        self.wait(1.5)
        self.play(FadeIn(summary), run_time=1.5)
        self.wait(2)