module.exports = {
    manimReference: `
MANIM COMMUNITY v0.19.1 STRICT API CONTRACT
THIS IS AUTHORITATIVE. DO NOT DEVIATE.

====================================================
VECTOR FIELD (CRITICAL SECTION)
====================================================

VALID USAGE:

field = VectorField(function)

Where:

function must accept a single argument "point"

Example:

def field_func(point):
    x, y = point[:2]
    return np.array([y, -x, 0])

field = VectorField(field_func)

OR

field = VectorField(
    lambda p: np.array([p[1], -p[0], 0])
)

----------------------------------------------------

VectorField in v0.19.1 DOES NOT ACCEPT:

✗ x_range
✗ y_range
✗ coordinate_system
✗ x_min
✗ x_max
✗ y_min
✗ y_max
✗ axes=
✗ Any matplotlib-style arguments
✗ Any undocumented keyword arguments

If ANY of these appear, the code is INVALID.

NEVER pass extra kwargs into VectorField.

====================================================
AXES RULES
====================================================

VALID:

axes = Axes(
    x_range=[-3, 3, 1],
    y_range=[-3, 3, 1]
)

graph = axes.plot(lambda x: x**2, x_range=[-2, 2])
region = axes.get_area(graph, x_range=[-2, 2])

----------------------------------------------------

INVALID:

✗ axes.get_area(lambda x: x**2, x_range=[-2, 2])
✗ Calling get_area before defining graph

====================================================
COLORS THAT EXIST
====================================================

WHITE, BLACK, GRAY, GREY
RED, GREEN, BLUE, YELLOW, PURPLE, ORANGE, PINK
GOLD, MAROON, TEAL
RED_A, RED_B, RED_C, RED_D, RED_E
GREEN_A, GREEN_B, GREEN_C, GREEN_D, GREEN_E
BLUE_A, BLUE_B, BLUE_C, BLUE_D, BLUE_E
YELLOW_A, YELLOW_B, YELLOW_C, YELLOW_D, YELLOW_E
PURPLE_A, PURPLE_B, PURPLE_C, PURPLE_D, PURPLE_E
LIGHT_GRAY, DARK_GRAY, DARKER_GRAY
GREY_A, GREY_B, GREY_C, GREY_D, GREY_E

----------------------------------------------------

COLORS THAT DO NOT EXIST:

GREEN_YELLOW, LIME, CYAN, MAGENTA
BROWN, BEIGE, TAN
NAVY, INDIGO, VIOLET

====================================================
ANIMATE RULES
====================================================

VALID:

self.play(obj.animate.shift(UP).scale(2))

INVALID:

✗ obj.shift(UP).animate
✗ obj.animate.shift(UP).animate
✗ Multiple .animate calls chained incorrectly

====================================================
BRACE RULES
====================================================

VALID:

brace = Brace(line)
label = MathTex("x").next_to(brace, DOWN)

INVALID:

✗ brace.get_text()
✗ brace.get_tex()

====================================================
SCENE RULES
====================================================

✓ Scene class name must match CLI scene name exactly
✓ All variables must be defined before use
✓ All numpy usage must use np.array([...])

====================================================

If unsure, use the simplest documented constructor possible.
Do NOT invent parameters.
Do NOT assume matplotlib behavior.
`
};