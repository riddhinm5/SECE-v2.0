<html>
<body>
<?php
$entries = array(
  array('id' => 1, 'pid' => 5, 'uid' => 2),
  array('id' => 2, 'pid' => 2, 'uid' => 3),
  array('id' => 3, 'pid' => 2, 'uid' => 4),
  array('id' => 4, 'pid' => 2, 'uid' => 6),
  array('id' => 5, 'pid' => 3, 'uid' => 7),
);

print_r($entries);

function adj_tree(&$tree, $item) {
    $i = $item['uid'];
    $p = $item['pid'];
    $tree[$i] = isset($tree[$i]) ? $item + $tree[$i] : $item;
    $tree[$p]['_children'][] = &$tree[$i];
}

$tree = array();
foreach($entries as $row)
    adj_tree($tree, $row);

function print_tree($node, $indent) {
    echo str_repeat('...', $indent) . $node['uid'], "<br>\n";
    if(isset($node['_children']))
        foreach($node['_children'] as $child)
            print_tree($child, $indent + 1);
}

print_tree($tree[2], 0);
?>
</body>
</html>