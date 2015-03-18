---
layout: post
title: UIView Inset Effect
---

I know shadows have been kicked to the curb with iOS 7 but I'm still a sucker for
a nice inset effect.

## The Mockup

Here is what the design (mocked up in [Sketch 3](http://bohemiancoding.com/sketch/))
called for:

<img src='/assets/inset-view/mockup.png' width='350px' />

In the example above the inset view is being used to contain a text field but
as you will see later on the inset will work and look okay with many inner views.

The inset effect view consists of a few attributes:

* background color that is slightly darker than its surroundings
* dark inner shadow
* faint outer shadow

<small>
<i><b>Hint:</b> I'm not a designer but the textured background on the surrounding view
in combination with the solid background of the inner view makes for a nice effect
in my opinion. Also, any and all design tips are welcome in the comments.</i>
</small>

## The Implementation

I will walk you through how I accomplished this effect though I am sure there are
many different ways including superior alternatives.

### Shadows

A `UIView` has a `layer` property which, as a `CALayer`, provides us with some
helpful properties for applying shadows. Those properties do not help us with
what Sketch would call _Inner Shadows_ so we'll have to get sneaky for the inner
shadow but the outer shadow will be straightforward.

#### Inner Shadow

I used a [YIInnerShadowView](https://github.com/inamiy/YIInnerShadowView) to accomplish
the inner shadow effect with a little bit of tweaking which I will get to in a minute.
I included the class as a pod using cocoapods.

#### Outer Shadow

As I mentioned above the `CALayer` class has a few properties for applying shadows.
Specifically `shadowRadius`, `shadowColor`, `shadowOpacity` and `shadowOffset` will
be of great use to us.

## FancyInsetView

That's what we'll call it, `FancyInsetView`. Assuming you checked out the `YIInnerShadowView`
class you might think it would be as easy as something like:

```swift

// initialize the view using YIInnerShadowView
let myView = YIInnerShadowView(frame: rect)
myView.backgroundColor = UIColor(red: 132/255.0, green: 43/255.0, blue: 10/255.0, alpha: 1.0)

// round the corners
myView.layer.cornerRadius = 5.0
myView.clipsToBounds = true

// customize the YIInnerShadow
myView.shadowRadius = 2.0
myView.shadowColor = UIColor(white: 4/255.0, alpha: 1.0)
myView.shadowOffset = CGSizeMake(0.0, 1.0)
myView.shadowOpacity = 0.5

// give it a faint outer shadow
myView.layer.masksToBounds = false
myView.layer.shadowRadius = 2.0
myView.layer.shadowColor = UIColor(red: 197/255.0, green: 88/255.0, blue: 53/255.0, alpha: 1.0).CGColor
myView.layer.shadowOpacity = 1.0
myView.layer.shadowOffset = CGSizeMake(0.0, 0.0)

```

With that most basic approach we end up with:

<img src='/assets/inset-view/fail1.png' width='300px' />

Which is close but not quite what we want. If you look closely, the
`YIInnerShadowView` is creating a dark, thin border around the view and the
corners are not rounded. The reason the corners are not rounded is because of

```swift
myView.layer.masksToBounds = false
```

Without that line the inner shadow view rounds like we want but the outer shadow
disappears. That is because in order for the outer shadow to show up we must set
`layer.masksToBounds` to `false`. So we have a problem.

### The Solution

We need rounded corners as well as a drop shadow so my solution involves an additional
view nested inside that contains the `YIInnerShadowView` and the outer view has the
outer shadow properties set.

I made the inner view just a pixel bigger than the container in order to hide the thin border.

```swift
class FancyInsetView: UIView {

  var innerShadow: YIInnerShadowView = {
    let view = YIInnerShadowView(frame: CGRectZero)
    view.shadowRadius = 2.0
    view.shadowColor = UIColor(white: 4/255.0, alpha: 1.0)
    view.shadowOffset = CGSizeMake(0.0, 1.0)
    view.shadowOpacity = 0.5
    return view
  }()

  var innerView: UIView!

  var cornerRadius: CGFloat = 5.0 {
    didSet {
      layer.cornerRadius = cornerRadius
      innerView.layer.cornerRadius = cornerRadius
    }
  }

  required init(coder aDecoder: NSCoder) {
    super.init(coder: aDecoder)
    setup()
  }

  override init(frame: CGRect) {
    super.init(frame: frame)
    setup()
  }

  func setup() {
    backgroundColor = UIColor(red: 132/255.0, green: 43/255.0, blue: 10/255.0, alpha: 1.0)
    clipsToBounds = true
    layer.masksToBounds = false

    // inner shadow
    innerView = UIView()
    innerView.layer.masksToBounds = true
    innerView.addSubview(innerShadow)
    insertSubview(innerView, atIndex: 0)

    // outer shadow
    layer.shadowRadius = 2.0
    layer.shadowColor = UIColor(red: 197/255.0, green: 88/255.0, blue: 53/255.0, alpha: 1.0).CGColor
    layer.shadowOpacity = 1.0
    layer.shadowOffset = CGSizeMake(0.0, 0.0)
  }

  override func layoutSubviews() {
    super.layoutSubviews()
    innerView.frame = bounds
    innerShadow.frame = CGRectInset(bounds, -1.0, -1.0)
  }

}

```

Here's how it turned out:

<img src='/assets/inset-view/success1.png' width='300px' />

That'll work! Code and demo are [on GitHub](https://github.com/n8armstrong/fancy-inset-view).
