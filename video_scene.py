from manim import *

import numpy as np

class VisualizeGPUsWork(Scene):
    def construct(self):
        title = Text("How GPUs Work").to_edge(UP)
        title.scale(0.9)
        self.play(Write(title), run_time=1.5)
        self.wait(1)

        step1 = Text("Step 1: Data as a Grid").to_edge(UP).scale(0.8)
        grid_axes = Axes(
            x_range=[0, 4, 1],
            y_range=[0, 4, 1]
        ).scale(0.8).to_edge(LEFT).shift(RIGHT*0.7)
        grid = VGroup()
        for i in range(1, 4):
            line = Line(
                grid_axes.coords_to_point(i, 0),
                grid_axes.coords_to_point(i, 3),
                color=GRAY
            )
            grid.add(line)
        for j in range(1, 4):
            line = Line(
                grid_axes.coords_to_point(0, j),
                grid_axes.coords_to_point(3, j),
                color=GRAY
            )
            grid.add(line)
        data_text = Text("Data").scale(0.7).next_to(grid_axes, DOWN, buff=0.7)
        self.play(FadeOut(title), Write(step1), Write(grid_axes), *[Create(line) for line in grid], FadeIn(data_text), run_time=2)
        self.wait(2)

        step2 = Text("Step 2: Many Cores").to_edge(UP).scale(0.8)
        self.play(FadeOut(step1), FadeOut(data_text), run_time=1)
        self.wait(1)
        core_dots = VGroup()
        for i in range(4):
            for j in range(4):
                dot = Dot(point=grid_axes.coords_to_point(i, j), color=BLUE)
                core_dots.add(dot)
        label_cores = Text("GPU Cores").scale(0.7).next_to(grid_axes, DOWN, buff=0.7)
        self.play(FadeIn(step2), *[FadeIn(dot, run_time=0.1) for dot in core_dots], FadeIn(label_cores), run_time=1.8)
        self.wait(2)

        step3 = Text("Step 3: Simultaneous Tasks").to_edge(UP).scale(0.8)
        self.play(FadeOut(step2), FadeOut(label_cores), run_time=1)
        self.wait(1)

        task_squares = VGroup()
        colors = [GREEN, YELLOW, RED, ORANGE]
        for i in range(4):
            for j in range(4):
                sq = Square(side_length=0.28).set_fill(colors[(i+j)%4], opacity=0.7)
                sq.move_to(grid_axes.coords_to_point(i, j))
                task_squares.add(sq)
        txt = Text("Each core processes\na data cell").scale(0.6).next_to(grid_axes, RIGHT, buff=0.7)
        self.play(FadeIn(step3), *[FadeIn(sq, run_time=0.05) for sq in task_squares[:8]], run_time=1)
        self.play(*[FadeIn(sq, run_time=0.06) for sq in task_squares[8:]], FadeIn(txt), run_time=1)
        self.wait(2)

        step4 = Text("Step 4: Parallel Processing").to_edge(UP).scale(0.8)
        self.play(FadeOut(step3), FadeOut(txt), run_time=1)
        self.wait(1)
        arrows = VGroup()
        for i in range(4):
            for j in range(4):
                arr = Arrow(
                    grid_axes.coords_to_point(i, j) + DOWN*0.15,
                    grid_axes.coords_to_point(i, j) + UP*0.15,
                    buff=0.1, color=BLUE
                ).scale(0.7)
                arrows.add(arr)
        pp_text = Text("All tasks\nrun at once!").scale(0.7).next_to(grid_axes, RIGHT, buff=0.7)
        self.play(FadeIn(step4), *[GrowArrow(arr, run_time=0.06) for arr in arrows[:8]], run_time=1)
        self.play(*[GrowArrow(arr, run_time=0.07) for arr in arrows[8:]], FadeIn(pp_text), run_time=1)
        self.wait(2)

        step5 = Text("Step 5: Output Results").to_edge(UP).scale(0.8)
        self.play(FadeOut(step4), FadeOut(pp_text), *[FadeOut(arr, run_time=0.1) for arr in arrows], run_time=1)
        self.wait(1)
        results = VGroup()
        for i in range(4):
            for j in range(4):
                res_dot = Dot(grid_axes.coords_to_point(i, j), color=GOLD, radius=0.12)
                results.add(res_dot)
        results_lbl = Text("Processed Data").scale(0.7).next_to(grid_axes, DOWN, buff=0.7)
        self.play(FadeIn(step5), *[FadeIn(res_dot, run_time=0.05) for res_dot in results[:8]], run_time=1)
        self.play(*[FadeIn(res_dot, run_time=0.06) for res_dot in results[8:]], FadeIn(results_lbl), run_time=1)
        self.wait(2)

        summary = Text("GPUs = Many Cores Working Together!").scale(0.8).to_edge(DOWN)
        self.play(FadeOut(step5), FadeOut(results_lbl), FadeOut(task_squares), run_time=1.2)
        self.play(FadeIn(summary), run_time=1)
        self.wait(2)
        self.play(*[FadeOut(mob) for mob in [summary, grid_axes, results]], run_time=1.2)
        self.wait(1)