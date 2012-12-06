SECE-v2.0
=========


Sense everything control everything with multiple floor plans and polygon areas in floor plans as well as maps


11/29 Meeting Notes
====================

Dashboard
---------
- Shows the object tree.
- By clicking on an object in the tree, the object is highlighted.

Add a New Floor Plan
--------------------
- There are three panes on the screen: steps 1, 2, and 3.

Step 1:
- Upload a new floor plan image
- Create a name for the floor plan
- Optionally select a group from a tree. If the user selects a group
that has geoloc information (such as building), then the Google maps
view automatically zooms to that object, otherwise you have to zoom
yourself.

Step 2:
- The user is presented with an image of the uploaded floor plan in
the second pane.
- The user can zoom in, zoom out, and rotate image.
- The user can place three different markers onto the floor plan
- Maker placement is done by drag&drop

Step 3:
- The user can rotate and position the floor plan in the Google maps view
- The markers in the google map are added automatically, the only
thing that the user needs to do is drag and drop.

Notes:
- the user can go back and forth and edit any of the choices made
until he/she hits the submit button. After clicking on the submit
button, the user is taken back to the dashboard where the newly
created floor plan is optionally highlighted.
- if the user navigates away from the webpage without saving the floor
plan, a popup warning shows up.
- The name of the Reset/Delete button is selected automatically based
on whether or not the object has already been saved in the database.

TODO:
- See if we could use the Google overlay-tiler, if yes, we can do away
with the middle pane and do all the editing inside the Google maps
view.

Modify/Delete Floor Plans
-------------------------
- Both operations are implemented via the drop down menu on items in
the tree view.
- To delete a floor plan, the user click on the trash icon and is
asked to confirm the action via a popup window.
- To edit a floor plan, the user clicks on the edit item and is taken
to the upload floor plan component with all options already filled in
with information stored in the database.
- If the user decides to delete the floor plan in the edit window,
there's a direct button to do that.

Trash (optional feature)
------------------------
- We may need to implement a trash bin where deleted objects will be
stored and can eventually be either recycled or recovered. If an
object is in the trash bin, then it is not available via the location
service (API) and it's not visible from the dashboard.


11/30 Meeting Notes
===================

Motivation
----------
- We need to build a hierarchical database of geospatial objects
(buildings, floors, rooms, furniture)
- Merge  the database with information from other sources is important
(we don't want to create all the polygons ourselves, only the missing
ones)
- For polygons stored in google maps, we need to be able to obtain the
polygon's control points so that we can store it in our own database
and perform geospatial queries on it. The user should be able to give
an object a name.
- because google maps cannot zoom enough, we need to be able to draw
polygons over floor plan images themselves and then translate the
coordinates.

Sources of information:
- Google Mapmaker (makes polygons available via Google Maps (?))
  - public spaces only
  - approval process in place
- Google maps
  - polygons overlays
  - client side, they are not stored in google maps

UI Design: Object Management
============================
The main navigation entity is the tree of all the objects. The tree
always has the root. The root exists even if there are no floor plans,
groups, or polygons. The user can add a new child element of a tree
item by pulling up the context menu of the item. The context menu has
items to:
  * add a floor plan
  * Add a polygon
  * Add a group
  * Edit
  * Move to trash
When the user clicks on "add a floor plan", the "upload floor plan" UI
will appear where the user can create a new floor plan and orient it
using google maps view. The parent of that floor plan will already be
pre-selected.

When the user click on "add a polygon", they will be taken to the
polygon editor. There will be a polygon editor UI for Google Maps, and
a separate one for floor plans. The system selects the appropriate
polygon editor depending on the parent node type.

When the user clicks on "add a group", a new item will appear in the
tree and the user can edit it's name.

Polygon Editors
---------------
Floor Plan Polygon Editor
-------------------------
The user is presented with a form to fill in details about the
polygon. The right side of the screen then shows the floor plan
covering the entire pane. There are icons to create polygons (circles,
squares, poly-lines). There's an option to show/hide existing
polygons. There might be an option to configure some properties of the
polygon. When done the user clicks on submit to finish the process. At
that point the polygon will be saved in the database and the user is
taken back to the Dashboard.

Google Maps Polygon Editor
--------------------------
The UI has two panes: a form with polygon information and a google
maps view with a search box. The user can enter text into the search
box and the view is repositioned and at the same time a JavaScript
query is performed to find the object. If an object is found, Google
maps returns the polygon (?). If we have only one result, we draw an
overlay over the maps view to highlight the polygon. If this is the
polygon the user wanted, they can fill out the form and click submit,
and the polygon gets saved into the database.

If the JavaScript query returns multiple results, markers for the
first X results are drawn on the map, the user can then select a
marker and the corresponding polygon will be highlighted and selected.

If no polygons are returned by the API or if the user is not satisfied
with any of them, he/she can use the drawing tools to draw a new
polygon on the map and click submit to save it.

TODO
====
- Can we get access to the database that Google maps already maintains?
- Can we also get access to polygons created by Google, and not just by users?
- Can we obtain the polygon for Old Town Square in Prague?


12/4 Meeting Notes
==================

Consistency Checks
------------------
- Do we need to ensure that the logical ordering of items in the tree
is synchronized with their geo-based ordering? Is this something the
user would expect?
- Maybe we could implement a button that would make it possible to
re-arrange the tree so that the user can see either the logical
ordering or the geo-based ordering of the tree
- The initial prototype will be without any consistency checks
- We may need to do A/B testing on a small group of users to see if
this is required at all

Locating Smart Objects
----------------------
- We'll have a database of smart objects with with inaccurate location
information
- The goal is to use the UI to find out precise location for each
smart object in an intuitive and user-friendly way
- We'll need location information with cm precision

SMOB Location
-------------
- Longitude
- Latitude
- Altitude
- Accuracy
- Altitude accuracy
- Timestamp
- Information source

- From the list of all smart objects the user has, we need to select
those that need manual adjusting. Those objects will be shown in UI so
that the  user can locate them.
How to select objects for manual location:
  1) Take a list of all user's smart objects
  2) Filter out all objects that have manual source of location information
  3) Filter out all objects with accuracy above some threshold.

- The UI presents two separate lists of Smart Objects to the user:
located smart objects and inaccurate smart objects.
- The list of inaccurate smart objects will be flat, with the
possibility to sort the list:
  - Alphabetically
  - Geographically
  - Timestamp (see newly added objects first)
- The list of located smart objects can be presented:
  - flat (sorted by location by default with the possibility to use
alphabetical sorting)
  - ? as tree overlaid with information from the polygon tree (where
objects coming from the polygon tree are dimmed)
     (what would happen if the tree hierarchy is not synchronized with
the geoloc-hierarchy)
     (may require A/B testing with real users to get right)

Locating Smart Objects
----------------------
- The user selects an object from the inaccurate list.
- The maps view will reposition to show the corresponding object
marker in the center of the maps, map will zoom automatically for
better location accuracy
- The user can drag and drop the marker
- The system detects the drop event, obtains longitude and latitude
from google maps and searches the database of floor plans
- The system loads all the floor plans and shows them to the user
along with some information about multiple plans (floors, overlapping,
etc..)
- The UI provides navigation for the user to select among overlapping
plans on the same level and also for plans for different floors
- The smallest enclosing plan is show first

- When the user attempts to re-locate an already located smart object,
the same ui shows up with the corresponding floor plan already shown
(basically we want for the user to return to the state where he/she
left off)

- Optionally the UI should have the option to locate the object
vertically (we can show a slider to locate the object within the
altitude range of the floor plan)

Dashboard
---------
- Show the following:
  - Tree of polygons
  - Tree of smart objects
  - Group polygons
  - A google map view with a search field

- By default we zoom to the user's location and show smart objects
nearby on the map
- Filter smart objects by name/text/whatever