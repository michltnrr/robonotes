from manim import *

import numpy as np

class VisualizeOperatingSystemWorks(Scene):
    def construct(self):
        title = Text("How an Operating System Works").to_edge(UP).scale(0.9)
        self.play(Write(title), run_time=1.5)
        self.wait(1)

        step1 = Text("Step 1: Hardware and Users", font_size=48).scale(0.8)
        step1.to_edge(DOWN)
        user = SVGMobject("manim_assets/user.svg") if hasattr(self, "assets") else Dot().set_color(BLUE).scale(2)
        cpu = Square().scale(1).set_color(GREEN).move_to(LEFT * 3)
        ram = Square().scale(1).set_color(RED).next_to(cpu, RIGHT, buff=1.2)
        disk = Square().scale(1).set_color(GOLD).next_to(ram, RIGHT, buff=1.2)
        cpu_label = Text("CPU", font_size=36).next_to(cpu, DOWN, buff=0.5)
        ram_label = Text("RAM", font_size=36).next_to(ram, DOWN, buff=0.5)
        disk_label = Text("Disk", font_size=36).next_to(disk, DOWN, buff=0.5)
        user_label = Text("User", font_size=36).next_to(user, UP, buff=0.5)
        group1 = VGroup(cpu, ram, disk, cpu_label, ram_label, disk_label)
        group2 = VGroup(user, user_label)
        group1.arrange(RIGHT, buff=1.2).move_to(DOWN*0.5)
        group2.next_to(group1, UP, buff=1.5)
        elements = VGroup(group1, group2)
        self.play(FadeIn(step1), GrowFromCenter(group1), GrowFromCenter(group2), run_time=2)
        self.wait(1.5)

        arrow1 = Arrow(user.get_bottom(), cpu.get_top(), buff=0.1)
        arrow2 = Arrow(user.get_bottom(), ram.get_top(), buff=0.1)
        arrow3 = Arrow(user.get_bottom(), disk.get_top(), buff=0.1)
        self.play(GrowArrow(arrow1), GrowArrow(arrow2), GrowArrow(arrow3), run_time=1.5)
        self.wait(1.5)

        self.play(FadeOut(step1), FadeOut(arrow1), FadeOut(arrow2), FadeOut(arrow3), FadeOut(group2))
        self.wait(1)

        step2 = Text("Step 2: The OS as Manager", font_size=48).scale(0.8).to_edge(DOWN)
        os_box = RoundedRectangle(corner_radius=0.4, width=7.5, height=3.5).set_color(BLUE)
        os_label = Text("Operating System", font_size=42).move_to(os_box.get_center())
        os_group = VGroup(os_box, os_label)
        os_group.move_to(UP * 0.5)
        self.play(FadeIn(step2), FadeIn(os_group), run_time=1.5)
        self.wait(1.5)

        os_to_hw1 = Arrow(os_box.get_bottom(), cpu.get_top(), buff=0.2)
        os_to_hw2 = Arrow(os_box.get_bottom(), ram.get_top(), buff=0.2)
        os_to_hw3 = Arrow(os_box.get_bottom(), disk.get_top(), buff=0.2)
        self.play(GrowArrow(os_to_hw1), GrowArrow(os_to_hw2), GrowArrow(os_to_hw3), run_time=1.2)
        self.wait(1.2)

        self.play(FadeOut(step2))
        self.wait(1)

        step3 = Text("Step 3: Managing Processes", font_size=48).scale(0.8).to_edge(DOWN)
        proc1 = Rectangle(height=0.7, width=1.5, color=YELLOW).next_to(os_box, UP, buff=0.5).shift(LEFT*2)
        proc2 = Rectangle(height=0.7, width=1.5, color=YELLOW).next_to(os_box, UP, buff=0.5)
        proc3 = Rectangle(height=0.7, width=1.5, color=YELLOW).next_to(os_box, UP, buff=0.5).shift(RIGHT*2)
        procs = VGroup(proc1, proc2, proc3)
        p1_label = Text("App A", font_size=28).move_to(proc1)
        p2_label = Text("App B", font_size=28).move_to(proc2)
        p3_label = Text("App C", font_size=28).move_to(proc3)
        proc_labels = VGroup(p1_label, p2_label, p3_label)
        self.play(FadeIn(step3), Create(proc1), Create(proc2), Create(proc3), FadeIn(proc_labels), run_time=1.4)
        self.wait(1.3)

        p2os = Arrow(proc2.get_bottom(), os_box.get_top(), buff=0.1)
        p1os = Arrow(proc1.get_bottom(), os_box.get_top(), buff=0.1)
        p3os = Arrow(proc3.get_bottom(), os_box.get_top(), buff=0.1)
        self.play(GrowArrow(p1os), GrowArrow(p2os), GrowArrow(p3os), run_time=1)
        self.wait(1.3)

        self.play(FadeOut(step3))
        self.wait(1)

        step4 = Text("Step 4: Handling Resources", font_size=48).scale(0.8).to_edge(DOWN)
        self.play(FadeIn(step4), run_time=1)
        self.wait(1.2)

        cpu_arrow = Arrow(os_box.get_left(), cpu.get_right(), color=BLUE, buff=0.1)
        ram_arrow = Arrow(os_box.get_bottom(), ram.get_top(), color=RED, buff=0.1)
        disk_arrow = Arrow(os_box.get_right(), disk.get_left(), color=GOLD, buff=0.1)
        self.play(GrowArrow(cpu_arrow), GrowArrow(ram_arrow), GrowArrow(disk_arrow), run_time=1.2)
        self.wait(1.2)

        highlight_box = SurroundingRectangle(os_box, color=WHITE, buff=0.1)
        self.play(Create(highlight_box), run_time=1)
        self.wait(1)

        self.play(FadeOut(step4), FadeOut(highlight_box))
        self.wait(1)

        step5 = Text("Step 5: Ensuring Security & Control", font_size=44).scale(0.8).to_edge(DOWN)
        shield = RegularPolygon(n=6).set_color(GREEN_D).scale(0.65).next_to(os_box, RIGHT, buff=1.4)
        shield_label = Text("Security", font_size=28).next_to(shield, DOWN, buff=0.3)
        locked = SVGMobject("manim_assets/lock.svg") if hasattr(self, "assets") else Dot().set_color(GRAY).scale(2).next_to(os_box, LEFT, buff=1.4)
        lock_label = Text("Control", font_size=28).next_to(locked, DOWN, buff=0.3)
        self.play(FadeIn(step5), FadeIn(shield), FadeIn(shield_label), FadeIn(locked), FadeIn(lock_label), run_time=1.3)
        self.wait(1.5)

        self.play(FadeOut(step5), FadeOut(shield), FadeOut(shield_label), FadeOut(locked), FadeOut(lock_label),
                  FadeOut(proc_labels), FadeOut(procs), run_time=1)
        self.wait(1)

        summary = Text("The OS: Connects Apps, Hardware, & Users").scale(0.75).to_edge(DOWN)
        self.play(FadeIn(summary), run_time=1)
        self.wait(2)

        self.play(FadeOut(summary), FadeOut(os_group), FadeOut(cpu), FadeOut(ram), FadeOut(disk), FadeOut(cpu_label), FadeOut(ram_label), FadeOut(disk_label), FadeOut(cpu_arrow), FadeOut(ram_arrow), FadeOut(disk_arrow), FadeOut(os_to_hw1), FadeOut(os_to_hw2), FadeOut(os_to_hw3))
        self.wait(1.2)

        last_text = Text("That's how an Operating System works!").scale(0.85).move_to(ORIGIN)
        self.play(FadeIn(last_text), run_time=1.6)
        self.wait(2)
        self.play(FadeOut(last_text), FadeOut(title), run_time=1.2)
        self.wait(1)