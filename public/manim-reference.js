module.exports = {
    manimReference: `
MANIM COMMUNITY v0.19 VERIFIED API REFERENCE

=== COLORS THAT EXIST ===
WHITE, BLACK, GRAY, GREY, RED, GREEN, BLUE, YELLOW, PURPLE, ORANGE, PINK, GOLD, MAROON, TEAL
RED_A, RED_B, RED_C, RED_D, RED_E
GREEN_A, GREEN_B, GREEN_C, GREEN_D, GREEN_E  
BLUE_A, BLUE_B, BLUE_C, BLUE_D, BLUE_E
YELLOW_A, YELLOW_B, YELLOW_C, YELLOW_D, YELLOW_E
PURPLE_A, PURPLE_B, PURPLE_C, PURPLE_D, PURPLE_E
LIGHT_GRAY, DARK_GRAY, DARKER_GRAY, GREY_A, GREY_B, GREY_C, GREY_D, GREY_E

COLORS THAT DON'T EXIST: GREEN_YELLOW, LIME, CYAN, MAGENTA, BROWN, BEIGE, TAN, NAVY, INDIGO, VIOLET

=== AXES METHODS ===
✓ axes.c2p(x, y) - Convert coordinates to point
✓ axes.p2c(point) - Convert point to coordinates
✓ axes.get_x_axis_label(text) - Returns label (style it AFTER with .set_color())
✓ axes.get_y_axis_label(text) - Returns label (style it AFTER with .set_color())
✗ axes.x_to_pixel() - DOES NOT EXIST
✗ axes.y_to_pixel() - DOES NOT EXIST
✗ axes.get_x_axis_label(text, color=...) - color param DOES NOT EXIST

=== ANIMATE ===
✓ self.play(obj.animate.shift(UP).scale(2))
✗ self.play(obj.animate.shift(UP).animate) - NO DOUBLE .animate
✗ self.play(obj.shift(UP).animate) - .animate comes FIRST

=== BRACE ===
✗ Brace.get_text() - DOES NOT EXIST
✗ Brace.get_tex() - DOES NOT EXIST
✓ Create Text/MathTex separately, use .next_to(brace)
`
};